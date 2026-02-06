from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel

class ToolResult(BaseModel):
    output: str
    error: Optional[str] = None
    metadata: Dict[str, Any] = {}
    
    @property
    def is_success(self) -> bool:
        return self.error is None

class BaseTool(ABC):
    name: str
    description: str
    
    @abstractmethod
    def get_schema(self) -> Dict[str, Any]:
        """Return the JSON schema for this tool's arguments."""
        pass
        
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool with the given arguments."""
        pass
