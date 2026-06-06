from pydantic import BaseModel # type: ignore
from typing import Optional, List

class DrugInfo(BaseModel):
    """Drug information model"""
    name: str
    name_am: Optional[str] = None
    name_or: Optional[str] = None
    purpose_en: str
    purpose_am: Optional[str] = None
    purpose_or: Optional[str] = None
    side_effects_en: str
    side_effects_am: Optional[str] = None
    side_effects_or: Optional[str] = None
    age_limit: str
    prescription: bool
    warning: str
    interactions: Optional[List[str]] = []