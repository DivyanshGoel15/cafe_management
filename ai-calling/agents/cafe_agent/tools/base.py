from typing import Dict, Any, Callable
from llm.base import ToolDefinition


class AgentTool:
    """Wrapper encapsulating a tool definition schema and its runtime executor."""

    def __init__(
        self,
        name: str,
        description: str,
        parameters: Dict[str, Any],
        executor: Callable[..., Any],
    ):
        self.name = name
        self.description = description
        self.parameters = parameters
        self.executor = executor

    def to_tool_definition(self) -> ToolDefinition:
        return ToolDefinition(
            name=self.name,
            description=self.description,
            parameters=self.parameters,
        )

    def execute(self, **kwargs) -> Any:
        return self.executor(**kwargs)
