from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class ExperimentCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    config: Optional[dict] = None

class ExperimentUpdateRequest(BaseModel):
    experiment_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    config: Optional[dict] = None

class VersionDetail(BaseModel):
    id: str
    experiment_id: str
    version_number: int
    status: str
    config: dict = {}
    conditions: Optional[List[Any]] = None
    created_at: Optional[str] = None
    published_at: Optional[str] = None


class ExperimentResponse(BaseModel):
    id: str
    experiment_id: Optional[int] = None
    version_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: str = "draft"
    author_id: str = "usr_admin"
    current_version: Optional[VersionDetail] = None
    created_at: str = ""
    updated_at: str = ""

class PublishRequest(BaseModel):
    experiment_id: Optional[int] = None

class VersionRequest(BaseModel):
    experiment_id: int
