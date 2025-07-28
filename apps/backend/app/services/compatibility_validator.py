import logging
from typing import Dict, List, Tuple, Optional
import re
import asyncio
from app.agent import AgentManager

logger = logging.getLogger(__name__)


class ProfessionalCompatibilityValidator:
    """
    Validates professional compatibility between resume and job posting
    to prevent unrealistic score inflations for incompatible career fields.
    """
    
    def __init__(self, language: str = "en"):
        self.agent_manager = AgentManager()
        self.language = language
    
    async def analyze_compatibility_with_ai(self, resume_text: str, job_text: str) -> Tuple[str, float, List[str]]:
        """Use AI to analyze professional compatibility between resume and job."""
        
        # Language-specific prompts
        prompts = {
            "en": f"""
Analyze professional compatibility between this resume and job posting. Be generous with compatibility ratings - most business/commercial roles share transferable skills.

RESUME:
{resume_text[:2000]}

JOB:
{job_text[:2000]}

Respond ONLY in JSON format:
{{
    "compatibility_level": "incompatible" | "low" | "moderate" | "high" | "excellent",
    "score_multiplier": 0.95,
    "reasons": ["reason 1", "reason 2"],
    "resume_area": "resume area",
    "job_area": "job area"
}}

Criteria (BE GENEROUS - look for transferable skills):
- incompatible (0.4): ONLY truly unrelated areas (e.g., surgery vs software engineering)
- low (0.6): Different areas but some transferable skills exist
- moderate (0.8): Related business/commercial areas with overlap
- high (0.95): Strong professional compatibility (DEFAULT for most business roles)
- excellent (1.0): Perfect match or same industry

IMPORTANT: Media, Marketing, Sales, Business Development, Partnerships, Strategy roles are ALL highly compatible with each other. Rate as "high" or "excellent".
""",
            "pt": f"""
Analise a compatibilidade profissional entre este currículo e vaga de emprego. Seja generoso na avaliação - a maioria dos cargos comerciais/business compartilham skills transferíveis.

CURRÍCULO:
{resume_text[:2000]}

VAGA:
{job_text[:2000]}

Responda APENAS no formato JSON:
{{
    "compatibility_level": "incompatible" | "low" | "moderate" | "high" | "excellent",
    "score_multiplier": 0.95,
    "reasons": ["motivo 1", "motivo 2"],
    "resume_area": "área do currículo",
    "job_area": "área da vaga"
}}

Critérios (SEJA GENEROSO - procure por skills transferíveis):
- incompatible (0.4): APENAS áreas verdadeiramente não relacionadas (ex: cirurgia vs engenharia de software)
- low (0.6): Áreas diferentes mas com algumas skills transferíveis
- moderate (0.8): Áreas comerciais/business relacionadas com sobreposição
- high (0.95): Forte compatibilidade profissional (PADRÃO para cargos business)
- excellent (1.0): Match perfeito ou mesma indústria

IMPORTANTE: Mídia, Marketing, Vendas, Business Development, Parcerias, Estratégia são TODOS altamente compatíveis. Avalie como "high" ou "excellent".
""",
            "es": f"""
Analiza la compatibilidad profesional entre este currículum y oferta de trabajo. Sé generoso con las calificaciones de compatibilidad - la mayoría de los roles comerciales/business comparten habilidades transferibles.

CURRÍCULUM:
{resume_text[:2000]}

TRABAJO:
{job_text[:2000]}

Responde SOLO en formato JSON:
{{
    "compatibility_level": "incompatible" | "low" | "moderate" | "high" | "excellent",
    "score_multiplier": 0.95,
    "reasons": ["razón 1", "razón 2"],
    "resume_area": "área del currículum",
    "job_area": "área del trabajo"
}}

Criterios (SÉ GENEROSO - busca habilidades transferibles):
- incompatible (0.4): SOLO áreas verdaderamente no relacionadas (ej: cirugía vs ingeniería de software)
- low (0.6): Áreas diferentes pero con algunas habilidades transferibles
- moderate (0.8): Áreas comerciales/business relacionadas con superposición
- high (0.95): Fuerte compatibilidad profesional (POR DEFECTO para roles business)
- excellent (1.0): Match perfecto o misma industria

IMPORTANTE: Medios, Marketing, Ventas, Business Development, Partnerships, Estrategia son TODOS altamente compatibles. Califica como "high" o "excellent".
"""
        }
        
        prompt = prompts.get(self.language, prompts["en"])

        try:
            response = await self.agent_manager.run(prompt)
            # Parse JSON response
            import json
            
            # Handle both string and dict responses
            if isinstance(response, dict):
                result = response
            else:
                result = json.loads(response)
            
            compatibility_level = result.get("compatibility_level", "moderate")
            score_multiplier = result.get("score_multiplier", 0.6)
            reasons = result.get("reasons", [])
            resume_area = result.get("resume_area", "")
            job_area = result.get("job_area", "")
            
            logger.info(f"AI Compatibility Analysis - Level: {compatibility_level}, Multiplier: {score_multiplier}")
            logger.info(f"Resume area: {resume_area}, Job area: {job_area}")
            
            return compatibility_level, score_multiplier, reasons
            
        except Exception as e:
            logger.error(f"AI compatibility analysis failed: {e}")
            # Fallback to high compatibility (less restrictive)
            return "high", 0.95, ["Análise automática não disponível"]
    
    def has_required_qualifications(self, resume_text: str, domain: str) -> bool:
        """Check if resume has required qualifications for the domain."""
        if domain not in self.professional_domains:
            return True  # If domain is unknown, assume compatible
            
        required_quals = self.professional_domains[domain]["required_qualifications"]
        if not required_quals:  # No specific requirements
            return True
            
        resume_lower = resume_text.lower()
        for qual in required_quals:
            if qual.lower() in resume_lower:
                return True
                
        return False
    
    async def calculate_compatibility_score(
        self, 
        resume_text: str, 
        job_text: str,
        original_score: float
    ) -> Tuple[float, str, List[str]]:
        """
        Calculate realistic compatibility score using AI analysis.
        
        Returns:
            - Adjusted score
            - Compatibility status
            - Warning messages
        """
        
        # Use AI to analyze compatibility
        compatibility_level, score_multiplier, reasons = await self.analyze_compatibility_with_ai(
            resume_text, job_text
        )
        
        # Calculate adjusted score
        adjusted_score = original_score * score_multiplier
        
        # Generate warnings based on compatibility level
        warnings = reasons.copy()
        if compatibility_level == "incompatible":
            warnings.insert(0, f"Score ajustado de {int(original_score*100)}% para {int(adjusted_score*100)}% devido à incompatibilidade")
        elif compatibility_level in ["low", "moderate"]:
            warnings.insert(0, f"Score ajustado de {int(original_score*100)}% para {int(adjusted_score*100)}% por compatibilidade limitada")
        
        logger.info(f"AI-based compatibility - Level: {compatibility_level}, Original: {original_score:.3f}, Adjusted: {adjusted_score:.3f}")
        
        return adjusted_score, compatibility_level, warnings
    
    def generate_realistic_suggestions(
        self, 
        compatibility_status: str,
        warnings: List[str]
    ) -> List[str]:
        """Generate realistic improvement suggestions based on AI compatibility analysis."""
        
        # Language-specific suggestions
        suggestions_templates = {
            "en": {
                "incompatible": [
                    "⚠️ Very different professional areas detected",
                    "🎯 Consider jobs more aligned with your experience",
                    "📚 If you want to change areas, consider transition courses",
                    "🔄 Identify and highlight transferable skills"
                ],
                "low": [
                    "📈 There is potential but with significant gaps",
                    "🎓 Consider developing area-specific competencies",
                    "💡 Highlight relevant experiences even if indirect"
                ],
                "moderate": [
                    "🔗 Highlight transferable skills and related experiences",
                    "💡 Emphasize applicable universal competencies",
                    "📊 Quantify results that demonstrate capability"
                ],
                "high": [
                    "✅ Good professional compatibility detected",
                    "🎯 Continue highlighting your main competencies",
                    "📊 Quantify specific results and impact"
                ],
                "fallback": [
                    "🔍 Compatibility analysis in progress",
                    "💼 Highlight your most relevant experiences",
                    "📈 Quantify your main results"
                ]
            },
            "pt": {
                "incompatible": [
                    "⚠️ Áreas profissionais muito diferentes detectadas",
                    "🎯 Considere vagas mais alinhadas com sua experiência",
                    "📚 Se deseja mudar de área, considere cursos de transição",
                    "🔄 Identifique e destaque skills transferíveis"
                ],
                "low": [
                    "📈 Há potencial mas com gaps significativos",
                    "🎓 Considere desenvolver competências específicas da área",
                    "💡 Destaque experiências relevantes mesmo que indiretas"
                ],
                "moderate": [
                    "🔗 Destaque skills transferíveis e experiências relacionadas",
                    "💡 Enfatize competências universais aplicáveis",
                    "📊 Quantifique resultados que demonstrem capacidade"
                ],
                "high": [
                    "✅ Boa compatibilidade profissional detectada",
                    "🎯 Continue destacando suas principais competências",
                    "📊 Quantifique resultados e impacto específicos"
                ],
                "fallback": [
                    "🔍 Análise de compatibilidade em andamento",
                    "💼 Destaque experiências mais relevantes",
                    "📈 Quantifique seus principais resultados"
                ]
            },
            "es": {
                "incompatible": [
                    "⚠️ Áreas profesionales muy diferentes detectadas",
                    "🎯 Considera trabajos más alineados con tu experiencia",
                    "📚 Si quieres cambiar de área, considera cursos de transición",
                    "🔄 Identifica y destaca habilidades transferibles"
                ],
                "low": [
                    "📈 Hay potencial pero con brechas significativas",
                    "🎓 Considera desarrollar competencias específicas del área",
                    "💡 Destaca experiencias relevantes aunque sean indirectas"
                ],
                "moderate": [
                    "🔗 Destaca habilidades transferibles y experiencias relacionadas",
                    "💡 Enfatiza competencias universales aplicables",
                    "📊 Cuantifica resultados que demuestren capacidad"
                ],
                "high": [
                    "✅ Buena compatibilidad profesional detectada",
                    "🎯 Continúa destacando tus principales competencias",
                    "📊 Cuantifica resultados e impacto específicos"
                ],
                "fallback": [
                    "🔍 Análisis de compatibilidad en progreso",
                    "💼 Destaca tus experiencias más relevantes",
                    "📈 Cuantifica tus principales resultados"
                ]
            }
        }
        
        templates = suggestions_templates.get(self.language, suggestions_templates["en"])
        suggestions = []
        
        if compatibility_status == "incompatible":
            suggestions.extend(templates["incompatible"])
        elif compatibility_status == "low":
            suggestions.extend(templates["low"])
        elif compatibility_status == "moderate":
            suggestions.extend(templates["moderate"])
        elif compatibility_status in ["high", "excellent"]:
            suggestions.extend(templates["high"])
        else:  # fallback
            suggestions.extend(templates["fallback"])
            
        return suggestions