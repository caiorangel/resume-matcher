from .base import PromptFactory

# Import all prompt modules explicitly to ensure they're loaded
from . import resume_improvement
from . import resume_improvement_pt
from . import resume_improvement_es
from . import structured_resume
from . import structured_resume_pt
from . import structured_resume_es
from . import structured_job
from . import structured_job_pt
from . import structured_job_es

prompt_factory = PromptFactory()
__all__ = ["prompt_factory"]
