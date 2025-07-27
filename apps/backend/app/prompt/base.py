import pkgutil
import importlib
from typing import Dict

from app.prompt import __path__ as prompt_pkg_path


class PromptFactory:
    def __init__(self) -> None:
        self._prompts: Dict[str, str] = {}
        self._discover()

    def _discover(self) -> None:
        # Iterate through all modules in the prompt package
        for finder, module_name, ispkg in pkgutil.iter_modules(prompt_pkg_path):
            if module_name.startswith("_") or module_name == "base":
                continue

            module = importlib.import_module(f"app.prompt.{module_name}")
            
            # Handle base prompts (ending with language codes)
            if module_name.endswith("_pt"):
                base_name = module_name[:-3]  # Remove "_pt" suffix
                if hasattr(module, "PROMPT_PT"):
                    self._prompts[f"{base_name}_pt"] = getattr(module, "PROMPT_PT")
            elif module_name.endswith("_es"):
                base_name = module_name[:-3]  # Remove "_es" suffix
                if hasattr(module, "PROMPT_ES"):
                    self._prompts[f"{base_name}_es"] = getattr(module, "PROMPT_ES")
            else:
                # Handle regular prompts
                if hasattr(module, "PROMPT"):
                    self._prompts[module_name] = getattr(module, "PROMPT")

    def list_prompts(self) -> Dict[str, str]:
        return self._prompts

    def get(self, name: str, language: str = "en") -> str:
        # Try to get language-specific prompt first
        if language != "en":
            try:
                return self._prompts[f"{name}_{language}"]
            except KeyError:
                pass
        
        # Fall back to default (English) prompt
        try:
            return self._prompts[name]
        except KeyError:
            raise KeyError(
                f"Prompt '{name}' not found. Available prompts: {list(self._prompts.keys())}"
            )