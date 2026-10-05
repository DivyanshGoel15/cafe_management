import re
from typing import Dict, Any, List, Tuple


class TemplateRenderError(Exception):
    """Raised when template rendering fails due to missing variables or syntax errors."""
    pass


class TemplateRenderer:
    """Renders WhatsApp message templates using double-curly braces {{variable_name}} syntax."""

    VARIABLE_REGEX = re.compile(r"\{\{\s*([a-zA-Z0-9_]+)\s*\}\}")

    @classmethod
    def extract_variables(cls, template_content: str) -> List[str]:
        """Extracts unique variable names found inside {{...}} in order of appearance."""
        if not template_content:
            return []
        found = cls.VARIABLE_REGEX.findall(template_content)
        # Preserve order while removing duplicates
        seen = set()
        result = []
        for var in found:
            if var not in seen:
                seen.add(var)
                result.append(var)
        return result

    @classmethod
    def validate_variables(cls, template_content: str, variables: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Validates if all required variables exist in the provided variable dictionary.
        Returns (is_valid, missing_variables_list).
        """
        required = cls.extract_variables(template_content)
        provided_keys = set(variables.keys()) if variables else set()
        missing = [v for v in required if v not in provided_keys or variables[v] is None]
        return len(missing) == 0, missing

    @classmethod
    def render(cls, template_content: str, variables: Dict[str, Any], strict: bool = False) -> str:
        """
        Renders template content by replacing variables.
        If strict is True and variables are missing, raises TemplateRenderError.
        If strict is False, replaces missing variables with empty string or keeps placeholder.
        """
        if not template_content:
            return ""

        if strict:
            is_valid, missing = cls.validate_variables(template_content, variables)
            if not is_valid:
                raise TemplateRenderError(
                    f"Missing required variables for template rendering: {', '.join(missing)}"
                )

        def replacer(match):
            key = match.group(1)
            val = variables.get(key)
            if val is not None:
                return str(val)
            return match.group(0) if not strict else ""

        return cls.VARIABLE_REGEX.sub(replacer, template_content)
