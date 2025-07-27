from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional


class ResumeImprovementRequest(BaseModel):
    job_id: UUID = Field(..., description="DB UUID reference to the job")
    resume_id: UUID = Field(..., description="DB UUID reference to the resume")
    language: Optional[str] = Field(default="en", description="Language for analysis (en, pt, es)")
