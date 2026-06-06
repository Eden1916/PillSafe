# src/routes/__init__.py - Routes package

from src.routes.drugs import router as drugs_router
from src.routes.scan import router as scan_router # type: ignore

__all__ = ["drugs_router", "scan_router"]