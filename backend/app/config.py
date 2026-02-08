"""Configuration loaded from environment variables."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings from .env file."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    
    # Core
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "change-me-in-production"
    
    # API URLs
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3001"
    allowed_origins: str = "http://localhost:3001,http://localhost:3000"
    
    # Gemini (Single key, single model)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3-flash-preview"
    gemini_max_tokens: int = 8192
    gemini_temperature: float = 0.1
    gemini_timeout_seconds: int = 60
    
    # Token optimization
    context_max_files: int = 40
    context_max_chars_per_file: int = 3000
    context_cache_ttl_seconds: int = 300
    use_structured_output: bool = True
    
    # Agent limits
    agent_max_iterations: int = 50
    agent_iteration_timeout: int = 60
    agent_total_timeout: int = 1800  # 30 minutes
    
    # Redis
    use_redis: bool = False
    redis_url: str = "redis://localhost:6379/0"
    
    # GitHub
    github_client_id: str = ""
    github_client_secret: str = ""
    
    # Workspaces
    workspace_base_path: str = "./workspaces"
    workspace_cleanup_after_hours: int = 24
    
    @property
    def origins_list(self) -> List[str]:
        """Parse allowed origins into list."""
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()
