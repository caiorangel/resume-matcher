import os
import uuid
import json
import tempfile
import logging

from markitdown import MarkItDown
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import ValidationError
from typing import Dict, Optional

from app.models import Resume, ProcessedResume
from app.agent import AgentManager
from app.prompt import prompt_factory
from app.schemas.json import json_schema_factory
from app.schemas.pydantic import StructuredResumeModel
from .exceptions import ResumeNotFoundError

logger = logging.getLogger(__name__)


class ResumeService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.md = MarkItDown(enable_plugins=False)
        self.json_agent_manager = AgentManager(model="gemma3:4b")

    async def convert_and_store_resume(
        self, file_bytes: bytes, file_type: str, filename: str, content_type: str = "md"
    ):
        """
        Converts resume file (PDF/DOCX) to text using MarkItDown and stores it in the database.

        Args:
            file_bytes: Raw bytes of the uploaded file
            file_type: MIME type of the file ("application/pdf" or "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            filename: Original filename
            content_type: Output format ("md" for markdown or "html")

        Returns:
            None
        """
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=self._get_file_extension(file_type)
        ) as temp_file:
            temp_file.write(file_bytes)
            temp_path = temp_file.name

        try:
            result = self.md.convert(temp_path)
            text_content = result.text_content
            resume_id = await self._store_resume_in_db(text_content, content_type)

            await self._extract_and_store_structured_resume(
                resume_id=resume_id, resume_text=text_content
            )

            return resume_id
        finally:
            # if os.path.exists(temp_path):
            #     os.remove(temp_path)
            pass

    def _get_file_extension(self, file_type: str) -> str:
        """Returns the appropriate file extension based on MIME type"""
        if file_type == "application/pdf":
            return ".pdf"
        elif (
            file_type
            == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ):
            return ".docx"
        return ""

    async def _store_resume_in_db(self, text_content: str, content_type: str):
        """
        Stores the parsed resume content in the database.
        """
        resume_id = str(uuid.uuid4())
        resume = Resume(
            resume_id=resume_id, content=text_content, content_type=content_type
        )

        self.db.add(resume)
        await self.db.flush()
        await self.db.commit()

        return resume_id

    async def _extract_and_store_structured_resume(
        self, resume_id, resume_text: str
    ) -> None:
        """
        extract and store structured resume data in the database
        """
        structured_resume = await self._extract_structured_json(resume_text)
        if not structured_resume:
            logger.info("Structured resume extraction failed.")
            return None

        processed_resume = ProcessedResume(
            resume_id=resume_id,
            personal_data=structured_resume.get("personal_data", {}),
            experiences={"experiences": structured_resume.get("experiences", [])},
            projects={"projects": structured_resume.get("projects", [])},
            skills={"skills": structured_resume.get("skills", [])},
            research_work={"research_work": structured_resume.get("research_work", [])},
            achievements={"achievements": structured_resume.get("achievements", [])},
            education={"education": structured_resume.get("education", [])},
            extracted_keywords={"extracted_keywords": structured_resume.get("extracted_keywords", [])},
        )

        self.db.add(processed_resume)
        try:
            await self.db.commit()
            logger.info(f"Successfully stored structured resume for resume_id: {resume_id}")
        except Exception as e:
            logger.error(f"DATABASE COMMIT FAILED for resume_id: {resume_id}. Error: {e}", exc_info=True)
            await self.db.rollback()
            raise

    async def _extract_structured_json(
        self, resume_text: str
    ) -> StructuredResumeModel | None:
        """
        Uses the AgentManager+JSONWrapper to ask the LLM to
        return the data in exact JSON schema we need.
        """
        prompt_template = prompt_factory.get("structured_resume")
        prompt = prompt_template.format(
            json.dumps(json_schema_factory.get("structured_resume"), indent=2),
            resume_text,
        )
        logger.info(f"Structured Resume Prompt: {prompt}")
        raw_output = await self.json_agent_manager.run(prompt=prompt)

        try:
            structured_resume: StructuredResumeModel = (
                StructuredResumeModel.model_validate(raw_output)
            )
        except ValidationError as e:
            logger.info(f"Validation error: {e}")
            return None
        return structured_resume.model_dump()

    async def get_resume_with_processed_data(self, resume_id: str) -> Optional[Dict]:
        """
        Fetches both resume and processed resume data from the database and combines them.

        Args:
            resume_id: The ID of the resume to retrieve

        Returns:
            Combined data from both resume and processed_resume models

        Raises:
            ResumeNotFoundError: If the resume is not found
        """
        resume_query = select(Resume).where(Resume.resume_id == resume_id)
        resume_result = await self.db.execute(resume_query)
        resume = resume_result.scalars().first()

        if not resume:
            raise ResumeNotFoundError(resume_id=resume_id)

        processed_query = select(ProcessedResume).where(ProcessedResume.resume_id == resume_id)
        processed_result = await self.db.execute(processed_query)
        processed_resume = processed_result.scalars().first()

        combined_data = {
            "resume_id": resume.resume_id,
            "raw_resume": {
                "id": resume.id,
                "content": resume.content,
                "content_type": resume.content_type,
                "created_at": resume.created_at.isoformat() if resume.created_at else None,
            },
            "processed_resume": None
        }

        if processed_resume:
            combined_data["processed_resume"] = {
                "personal_data": json.loads(processed_resume.personal_data) if processed_resume.personal_data else None,
                "experiences": json.loads(processed_resume.experiences).get("experiences", []) if processed_resume.experiences else None,
                "projects": json.loads(processed_resume.projects).get("projects", []) if processed_resume.projects else None,
                "skills": json.loads(processed_resume.skills).get("skills", []) if processed_resume.skills else None,
                "research_work": json.loads(processed_resume.research_work).get("research_work", []) if processed_resume.research_work else None,
                "achievements": json.loads(processed_resume.achievements).get("achievements", []) if processed_resume.achievements else None,
                "education": json.loads(processed_resume.education).get("education", []) if processed_resume.education else None,
                "extracted_keywords": json.loads(processed_resume.extracted_keywords).get("extracted_keywords", []) if processed_resume.extracted_keywords else None,
                "processed_at": processed_resume.processed_at.isoformat() if processed_resume.processed_at else None,
            }

        return combined_data
