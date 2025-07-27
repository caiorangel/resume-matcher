import gc
import json
import asyncio
import logging
import markdown
import numpy as np

from sqlalchemy.future import select
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Optional, Tuple, AsyncGenerator, List

from app.prompt import prompt_factory
from app.schemas.json import json_schema_factory
from app.schemas.pydantic import ResumePreviewerModel
from app.agent import EmbeddingManager, AgentManager
from app.models import Resume, Job, ProcessedResume, ProcessedJob
from .compatibility_validator import ProfessionalCompatibilityValidator
from .exceptions import (
    ResumeNotFoundError,
    JobNotFoundError,
    ResumeParsingError,
    JobParsingError,
)

logger = logging.getLogger(__name__)


class ScoreImprovementService:
    """
    Service to handle scoring of resumes and jobs using embeddings.
    Fetches Resume and Job data from the database, computes embeddings,
    and calculates cosine similarity scores. Uses LLM for iteratively improving
    the scoring process.
    """

    def __init__(self, db: AsyncSession, max_retries: int = 5, language: str = "en"):
        self.db = db
        self.max_retries = max_retries
        self.language = language
        self.md_agent_manager = AgentManager(strategy="md")
        self.json_agent_manager = AgentManager()
        self.embedding_manager = EmbeddingManager()
        self.compatibility_validator = ProfessionalCompatibilityValidator(language=language)

    async def _get_resume(
        self, resume_id: str
    ) -> Tuple[Resume | None, ProcessedResume | None]:
        """
        Fetches the resume from the database.
        """
        query = select(Resume).where(Resume.resume_id == resume_id)
        result = await self.db.execute(query)
        resume = result.scalars().first()

        if not resume:
            raise ResumeNotFoundError(resume_id=resume_id)

        query = select(ProcessedResume).where(ProcessedResume.resume_id == resume_id)
        result = await self.db.execute(query)
        processed_resume = result.scalars().first()

        if not processed_resume:
            # Create a minimal ProcessedResume entry to avoid blocking analysis
            logger.warning(f"ProcessedResume not found for resume_id {resume_id}, creating minimal entry")
            processed_resume = ProcessedResume(
                resume_id=resume_id,
                extracted_keywords='{"extracted_keywords": []}'
            )
            self.db.add(processed_resume)
            await self.db.flush()

        return resume, processed_resume

    async def _get_job(self, job_id: str) -> Tuple[Job | None, ProcessedJob | None]:
        """
        Fetches the job from the database.
        """
        query = select(Job).where(Job.job_id == job_id)
        result = await self.db.execute(query)
        job = result.scalars().first()

        if not job:
            raise JobNotFoundError(job_id=job_id)

        query = select(ProcessedJob).where(ProcessedJob.job_id == job_id)
        result = await self.db.execute(query)
        processed_job = result.scalars().first()

        if not processed_job:
            # Create a minimal ProcessedJob entry to avoid blocking analysis
            logger.warning(f"ProcessedJob not found for job_id {job_id}, creating minimal entry")
            processed_job = ProcessedJob(
                job_id=job_id,
                job_title="Unknown Position",
                extracted_keywords='{"extracted_keywords": []}'
            )
            self.db.add(processed_job)
            await self.db.flush()

        return job, processed_job

    def calculate_cosine_similarity(
        self,
        extracted_job_keywords_embedding: np.ndarray,
        resume_embedding: np.ndarray,
    ) -> float:
        """
        Calculates the cosine similarity between two embeddings.
        """
        if resume_embedding is None or extracted_job_keywords_embedding is None:
            return 0.0

        ejk = np.asarray(extracted_job_keywords_embedding).squeeze()
        re = np.asarray(resume_embedding).squeeze()

        return float(np.dot(ejk, re) / (np.linalg.norm(ejk) * np.linalg.norm(re)))

    async def improve_score_with_llm(
        self,
        resume: str,
        extracted_resume_keywords: str,
        job: str,
        extracted_job_keywords: str,
        previous_cosine_similarity_score: float,
        extracted_job_keywords_embedding: np.ndarray,
    ) -> Tuple[str, float]:
        # Check compatibility before attempting optimization
        _, compatibility_status, warnings = await self.compatibility_validator.calculate_compatibility_score(
            resume, job, previous_cosine_similarity_score
        )
        
        # Skip optimization for incompatible domains to prevent unrealistic resume generation
        if compatibility_status == "incompatible":
            logger.warning(f"Skipping LLM optimization due to incompatible areas: {warnings}")
            return resume, previous_cosine_similarity_score
        
        # Get the appropriate prompt based on language
        prompt_template = prompt_factory.get("resume_improvement", self.language)
        best_resume, best_score = resume, previous_cosine_similarity_score

        for attempt in range(1, self.max_retries + 1):
            logger.info(
                f"Attempt {attempt}/{self.max_retries} to improve resume score."
            )
            prompt = prompt_template.format(
                raw_job_description=job,
                extracted_job_keywords=extracted_job_keywords,
                raw_resume=best_resume,
                extracted_resume_keywords=extracted_resume_keywords,
                current_cosine_similarity=best_score,
            )
            improved = await self.md_agent_manager.run(prompt)
            emb = await self.embedding_manager.embed(text=improved)
            score = self.calculate_cosine_similarity(
                emb, extracted_job_keywords_embedding
            )

            if score > best_score:
                return improved, score

            logger.info(
                f"Attempt {attempt} resulted in score: {score}, best score so far: {best_score}"
            )

        return best_resume, best_score
    
    async def generate_detailed_analysis(
        self,
        original_score: float,
        new_score: float,
        extracted_job_keywords: str,
        extracted_resume_keywords: str,
        job_content: str,
        resume_content: str,
        compatibility_status: str = None,
        compatibility_warnings: list = None,
    ) -> dict:
        """
        Generate detailed analysis including commentary and improvement suggestions.
        """
        # Use the compatibility data already provided
        if compatibility_status is None or compatibility_warnings is None:
            # Fallback if not provided
            validated_original_score, compatibility_status, warnings = await self.compatibility_validator.calculate_compatibility_score(
                resume_content, job_content, original_score
            )
            validated_new_score = new_score
        else:
            validated_original_score = original_score  # Already validated
            validated_new_score = new_score
            warnings = compatibility_warnings or []
        
        score_improvement = validated_new_score - validated_original_score
        score_percentage = int(validated_new_score * 100)
        
        logger.info(f"Generating suggestions - Original Score: {original_score:.3f}, Validated Score: {validated_new_score:.3f}")
        logger.info(f"Compatibility Status: {compatibility_status}, Warnings: {warnings}")
        
        # Generate commentary based on validated score and compatibility status
        commentary_templates = {
            "en": {
                "incompatible": f"⚠️ Incompatibility detected between professional areas. Score adjusted to {score_percentage}% (was {int(original_score * 100)}%).",
                "low": f"Limited compatibility detected. Score adjusted to {score_percentage}%.",
                "excellent": "Excellent compatibility! Your resume is very well aligned with the job requirements.",
                "good": "Good compatibility. Your resume demonstrates relevant qualifications for the position.",
                "moderate": "Moderate compatibility. There are some areas that can be improved for better alignment.",
                "low_score": "Low compatibility. Consider highlighting more relevant experiences for this job."
            },
            "pt": {
                "incompatible": f"⚠️ Incompatibilidade detectada entre áreas profissionais. Score ajustado para {score_percentage}% (era {int(original_score * 100)}%).",
                "low": f"Compatibilidade limitada detectada. Score ajustado para {score_percentage}%.",
                "excellent": "Excelente compatibilidade! Seu currículo está muito bem alinhado com os requisitos da vaga.",
                "good": "Boa compatibilidade. Seu currículo demonstra qualificações relevantes para a posição.",
                "moderate": "Compatibilidade moderada. Há algumas áreas que podem ser melhoradas para maior alinhamento.",
                "low_score": "Baixa compatibilidade. Considere destacar mais experiências relevantes para esta vaga."
            },
            "es": {
                "incompatible": f"⚠️ Incompatibilidad detectada entre áreas profesionales. Puntuación ajustada a {score_percentage}% (era {int(original_score * 100)}%).",
                "low": f"Compatibilidad limitada detectada. Puntuación ajustada a {score_percentage}%.",
                "excellent": "¡Excelente compatibilidad! Tu currículum está muy bien alineado con los requisitos del trabajo.",
                "good": "Buena compatibilidad. Tu currículum demuestra calificaciones relevantes para la posición.",
                "moderate": "Compatibilidad moderada. Hay algunas áreas que pueden mejorarse para mejor alineación.",
                "low_score": "Baja compatibilidad. Considera destacar más experiencias relevantes para este trabajo."
            }
        }
        
        templates = commentary_templates.get(self.language, commentary_templates["en"])
        
        if compatibility_status == "incompatible":
            commentary = templates["incompatible"]
        elif compatibility_status == "low":
            commentary = templates["low"]
        elif score_percentage >= 90:
            commentary = templates["excellent"]
        elif score_percentage >= 80:
            commentary = templates["good"]
        elif score_percentage >= 70:
            commentary = templates["moderate"]
        else:
            commentary = templates["low_score"]
            
        # Generate improvement suggestions using compatibility validator
        improvements = self.compatibility_validator.generate_realistic_suggestions(
            compatibility_status, warnings
        )
        
        # Add score improvement info if there was actual improvement
        improvement_texts = {
            "en": f"✅ Score improved by {score_improvement:.2f} points after optimization",
            "pt": f"✅ Score melhorado em {score_improvement:.2f} pontos após otimização",
            "es": f"✅ Puntuación mejorada en {score_improvement:.2f} puntos después de la optimización"
        }
        
        if score_improvement > 0:
            improvement_text = improvement_texts.get(self.language, improvement_texts["en"])
            improvements.insert(0, improvement_text)
        
        logger.info(f"Generated {len(improvements)} realistic suggestions based on compatibility")
            
        # Generate detailed analysis
        job_kw_count = len([kw.strip() for kw in extracted_job_keywords.split(',') if kw.strip()]) if extracted_job_keywords else 0
        resume_kw_count = len([kw.strip() for kw in extracted_resume_keywords.split(',') if kw.strip()]) if extracted_resume_keywords else 0
        
        # Language-specific analysis templates
        analysis_templates = {
            "en": {
                "title": "📊 **Detailed Compatibility Analysis**",
                "incompatible": "⚠️ **Incompatibility Detected:** Very different professional areas",
                "limited": "📋 **Limited Compatibility:** Significant gaps identified",
                "observations": "💡 **Observations:**",
                "scoring": "🎯 **Scoring:**",
                "original": "Original score",
                "validated": "Validated score", 
                "adjustment": "Compatibility adjustment",
                "status": "Status",
                "keywords": "🔍 **Keyword Analysis:**",
                "job_keywords": "Job keywords",
                "resume_keywords": "Resume keywords",
                "coverage": "Coverage rate",
                "methodology": "🤖 **Methodology:**",
                "methodology_text": "The system uses AI embeddings (OpenAI) combined with professional compatibility validation to calculate realistic scores. The analysis considers semantic similarity but applies penalties for domain incompatibilities."
            },
            "pt": {
                "title": "📊 **Análise de Compatibilidade Detalhada**",
                "incompatible": "⚠️ **Incompatibilidade Detectada:** Áreas profissionais muito diferentes",
                "limited": "📋 **Compatibilidade Limitada:** Gaps significativos identificados",
                "observations": "💡 **Observações:**",
                "scoring": "🎯 **Pontuação:**",
                "original": "Score original",
                "validated": "Score validado",
                "adjustment": "Ajuste de compatibilidade",
                "status": "Status",
                "keywords": "🔍 **Análise de Palavras-chave:**",
                "job_keywords": "Palavras-chave da vaga",
                "resume_keywords": "Palavras-chave no currículo",
                "coverage": "Taxa de cobertura",
                "methodology": "🤖 **Metodologia:**",
                "methodology_text": "O sistema utiliza embeddings de IA (OpenAI) combinados com validação de compatibilidade profissional para calcular scores realistas. A análise considera similaridade semântica, mas aplica penalizações para incompatibilidades de domínio."
            },
            "es": {
                "title": "📊 **Análisis de Compatibilidad Detallado**",
                "incompatible": "⚠️ **Incompatibilidad Detectada:** Áreas profesionales muy diferentes",
                "limited": "📋 **Compatibilidad Limitada:** Brechas significativas identificadas",
                "observations": "💡 **Observaciones:**",
                "scoring": "🎯 **Puntuación:**",
                "original": "Puntuación original",
                "validated": "Puntuación validada",
                "adjustment": "Ajuste de compatibilidad",
                "status": "Estado",
                "keywords": "🔍 **Análisis de Palabras Clave:**",
                "job_keywords": "Palabras clave del trabajo",
                "resume_keywords": "Palabras clave del currículum",
                "coverage": "Tasa de cobertura",
                "methodology": "🤖 **Metodología:**",
                "methodology_text": "El sistema utiliza embeddings de IA (OpenAI) combinados con validación de compatibilidad profesional para calcular puntuaciones realistas. El análisis considera similitud semántica pero aplica penalizaciones por incompatibilidades de dominio."
            }
        }
        
        t = analysis_templates.get(self.language, analysis_templates["en"])
        
        compatibility_info = ""
        if compatibility_status == "incompatible":
            compatibility_info = f"\n{t['incompatible']}\n"
        elif compatibility_status == "low":
            compatibility_info = f"\n{t['limited']}\n"
        elif warnings:
            compatibility_info = f"\n{t['observations']} {'; '.join(warnings[:2])}\n"
            
        # Show improvement if there was actual optimization
        score_section = f"""
{t['scoring']}
• {t['original']}: {validated_original_score:.3f} ({int(validated_original_score*100)}%)"""
        
        if score_improvement > 0.01:  # Only show new score if there was meaningful improvement
            score_section += f"""
• Optimized: {validated_new_score:.3f} ({int(validated_new_score*100)}%)
• Improvement: +{score_improvement:.3f} pontos"""
        
        score_section += f"""
• {t['status']}: {compatibility_status.replace('_', ' ').title()}"""
        
        details = f"""{t['title']}
{compatibility_info}
{score_section}

{t['keywords']}
• {t['job_keywords']}: {job_kw_count}
• {t['resume_keywords']}: {resume_kw_count}
• {t['coverage']}: {int((resume_kw_count/job_kw_count*100)) if job_kw_count > 0 else 0}%

{t['methodology']}
{t['methodology_text']}""".strip()
        
        # Convert improvements to the format expected by frontend
        formatted_improvements = [
            {"suggestion": suggestion, "lineNumber": None} 
            for suggestion in improvements
        ]
        
        return {
            "details": details,
            "commentary": commentary,
            "improvements": formatted_improvements
        }

    async def get_resume_for_previewer(self, updated_resume: str) -> Dict:
        """
        Returns the updated resume in a format suitable for the dashboard.
        """
        # Get the appropriate prompt based on language
        prompt_template = prompt_factory.get("structured_resume", self.language)
        prompt = prompt_template.format(
            json.dumps(json_schema_factory.get("resume_preview"), indent=2),
            updated_resume,
        )
        logger.info(f"Structured Resume Prompt: {prompt}")
        raw_output = await self.json_agent_manager.run(prompt=prompt)

        try:
            resume_preview: ResumePreviewerModel = ResumePreviewerModel.model_validate(
                raw_output
            )
        except ValidationError as e:
            logger.info(f"Validation error: {e}")
            return None
        return resume_preview.model_dump()

    async def run(self, resume_id: str, job_id: str) -> Dict:
        """
        Main method to run the scoring and improving process and return dict.
        """

        resume, processed_resume = await self._get_resume(resume_id)
        job, processed_job = await self._get_job(job_id)

        if processed_job.extracted_keywords:
            try:
                keywords_data = json.loads(processed_job.extracted_keywords)
                extracted_job_keywords = ", ".join(keywords_data.get("extracted_keywords", []))
            except (json.JSONDecodeError, TypeError):
                extracted_job_keywords = ""
        else:
            extracted_job_keywords = ""

        if processed_resume and processed_resume.extracted_keywords:
            try:
                keywords_data = json.loads(processed_resume.extracted_keywords)
                if keywords_data:
                    extracted_resume_keywords = ", ".join(
                        keywords_data.get("extracted_keywords", [])
                    )
                else:
                    extracted_resume_keywords = ""
            except (json.JSONDecodeError, TypeError):
                extracted_resume_keywords = ""
        else:
            extracted_resume_keywords = ""

        resume_embedding_task = asyncio.create_task(
            self.embedding_manager.embed(resume.content)
        )
        job_kw_embedding_task = asyncio.create_task(
            self.embedding_manager.embed(extracted_job_keywords)
        )
        resume_embedding, extracted_job_keywords_embedding = await asyncio.gather(
            resume_embedding_task, job_kw_embedding_task
        )

        # Calculate initial cosine similarity
        cosine_similarity_score = self.calculate_cosine_similarity(
            extracted_job_keywords_embedding, resume_embedding
        )
        
        # Apply compatibility validation FIRST to get realistic baseline score
        validated_original_score, compatibility_status, warnings = await self.compatibility_validator.calculate_compatibility_score(
            resume.content, job.content, cosine_similarity_score
        )
        
        # Use validated score as the baseline for optimization
        updated_resume, updated_score = await self.improve_score_with_llm(
            resume=resume.content,
            extracted_resume_keywords=extracted_resume_keywords,
            job=job.content,
            extracted_job_keywords=extracted_job_keywords,
            previous_cosine_similarity_score=validated_original_score,  # Use validated score as starting point
            extracted_job_keywords_embedding=extracted_job_keywords_embedding,
        )

        resume_preview = await self.get_resume_for_previewer(
            updated_resume=updated_resume
        )

        # Generate detailed analysis using the already validated scores
        detailed_analysis = await self.generate_detailed_analysis(
            original_score=validated_original_score,  # Use the already validated score
            new_score=updated_score,
            extracted_job_keywords=extracted_job_keywords,
            extracted_resume_keywords=extracted_resume_keywords,
            job_content=job.content,
            resume_content=resume.content,
            compatibility_status=compatibility_status,
            compatibility_warnings=warnings,
        )

        logger.info(f"Resume Preview: {resume_preview}")
        logger.info(f"Final scores - Raw Cosine: {cosine_similarity_score:.3f}, Validated Original: {validated_original_score:.3f}, Optimized: {updated_score:.3f}")

        execution = {
            "resume_id": resume_id,
            "job_id": job_id,
            "original_score": validated_original_score,  # Show the realistic score from start
            "new_score": updated_score,  # Score after optimization
            "updated_resume": markdown.markdown(text=updated_resume),
            "resume_preview": resume_preview,
            **detailed_analysis,  # Include details, commentary, and improvements
        }

        gc.collect()

        return execution

    async def run_and_stream(self, resume_id: str, job_id: str) -> AsyncGenerator:
        """
        Main method to run the scoring and improving process and return dict.
        """

        yield f"data: {json.dumps({'status': 'starting', 'message': 'Analyzing resume and job description...'})}\n\n"
        await asyncio.sleep(2)

        resume, processed_resume = await self._get_resume(resume_id)
        job, processed_job = await self._get_job(job_id)

        yield f"data: {json.dumps({'status': 'parsing', 'message': 'Parsing resume content...'})}\n\n"
        await asyncio.sleep(2)

        if processed_job.extracted_keywords:
            try:
                keywords_data = json.loads(processed_job.extracted_keywords)
                extracted_job_keywords = ", ".join(keywords_data.get("extracted_keywords", []))
            except (json.JSONDecodeError, TypeError):
                extracted_job_keywords = ""
        else:
            extracted_job_keywords = ""

        if processed_resume and processed_resume.extracted_keywords:
            try:
                keywords_data = json.loads(processed_resume.extracted_keywords)
                if keywords_data:
                    extracted_resume_keywords = ", ".join(
                        keywords_data.get("extracted_keywords", [])
                    )
                else:
                    extracted_resume_keywords = ""
            except (json.JSONDecodeError, TypeError):
                extracted_resume_keywords = ""
        else:
            extracted_resume_keywords = ""

        resume_embedding = await self.embedding_manager.embed(text=resume.content)
        extracted_job_keywords_embedding = await self.embedding_manager.embed(
            text=extracted_job_keywords
        )

        yield f"data: {json.dumps({'status': 'scoring', 'message': 'Calculating compatibility score...'})}\n\n"
        await asyncio.sleep(3)

        cosine_similarity_score = self.calculate_cosine_similarity(
            extracted_job_keywords_embedding, resume_embedding
        )

        yield f"data: {json.dumps({'status': 'scored', 'score': cosine_similarity_score})}\n\n"

        yield f"data: {json.dumps({'status': 'improving', 'message': 'Generating improvement suggestions...'})}\n\n"
        await asyncio.sleep(3)

        updated_resume, updated_score = await self.improve_score_with_llm(
            resume=resume.content,
            extracted_resume_keywords=extracted_resume_keywords,
            job=job.content,
            extracted_job_keywords=extracted_job_keywords,
            previous_cosine_similarity_score=cosine_similarity_score,
            extracted_job_keywords_embedding=extracted_job_keywords_embedding,
        )

        for i, suggestion in enumerate(updated_resume):
            yield f"data: {json.dumps({'status': 'suggestion', 'index': i, 'text': suggestion})}\n\n"
            await asyncio.sleep(0.2)

        final_result = {
            "resume_id": resume_id,
            "job_id": job_id,
            "original_score": cosine_similarity_score,
            "new_score": updated_score,
            "updated_resume": markdown.markdown(text=updated_resume),
        }

        yield f"data: {json.dumps({'status': 'completed', 'result': final_result})}\n\n"
