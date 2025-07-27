import os
import logging

from openai import OpenAI
from typing import Any, Dict
from fastapi.concurrency import run_in_threadpool

from ..exceptions import ProviderError
from .base import Provider, EmbeddingProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(Provider):
    def __init__(self, api_key: str | None = None, model: str = "o3-mini-2025-01-31"):
        api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ProviderError("OpenAI API key is missing")
        self._client = OpenAI(api_key=api_key)
        self.model = model
        self.instructions = ""

    def _generate_sync(self, prompt: str, options: Dict[str, Any]) -> str:
        try:
            # Remove unsupported parameters for OpenAI API
            clean_options = {k: v for k, v in options.items() if k not in ['top_k', 'temperature', 'top_p']}
            
            response = self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.instructions},
                    {"role": "user", "content": prompt}
                ],
                **clean_options,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise ProviderError(f"OpenAI - error generating response: {e}") from e

    async def __call__(self, prompt: str, **generation_args: Any) -> str:
        # OpenAI models have a maximum completion token limit (typically 16384)
        # Using a safer default that's well below the limit
        max_length = min(generation_args.get("max_length", 15000), 16000)
        opts = {
            "max_completion_tokens": max_length,
        }
        return await run_in_threadpool(self._generate_sync, prompt, opts)


class OpenAIEmbeddingProvider(EmbeddingProvider):
    def __init__(
        self,
        api_key: str | None = None,
        embedding_model: str = "text-embedding-3-small",
    ):
        api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ProviderError("OpenAI API key is missing")
        self._client = OpenAI(api_key=api_key)
        self._model = embedding_model

    async def embed(self, text: str) -> list[float]:
        try:
            response = await run_in_threadpool(
                self._client.embeddings.create, input=text, model=self._model
            )
            return response.data[0].embedding
        except Exception as e:
            raise ProviderError(f"OpenAI - error generating embedding: {e}") from e
