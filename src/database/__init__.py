# src/database/__init__.py - Database package

from src.database.drugs_data import DRUGS_DB, get_drug, get_all_drugs # type: ignore

__all__ = ["DRUGS_DB", "get_drug", "get_all_drugs"]