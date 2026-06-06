# src/routes/drugs.py - Drug search endpoints

from fastapi import APIRouter # type: ignore
from src.database.drugs_data import get_drug, get_all_drugs, DRUGS_DB # type: ignore

router = APIRouter()

@router.get("/")
def home():
    return {
        "message": "Dawa Info API is running! 🚀",
        "status": "active",
        "endpoints": {
            "search": "/drug/{name}",
            "search_with_lang": "/drug/{name}/{lang}",
            "all_drugs": "/drugs",
            "scan": "POST /scan"
        }
    }

@router.get("/test")
def test():
    return {"success": True, "message": "API is working!"}

@router.get("/drugs")
def list_drugs():
    """List all available drugs"""
    return {
        "count": len(get_all_drugs()),
        "drugs": get_all_drugs()
    }

@router.get("/drug/{drug_name}")
def search_drug(drug_name: str):
    """Search drug by name (English)"""
    drug = get_drug(drug_name)
    
    if drug:
        return {"success": True, "data": drug}
    else:
        return {
            "success": False,
            "error": f"Drug '{drug_name}' not found",
            "suggestions": get_all_drugs()
        }
@router.get("/health")
def health():
    return {"status": "healthy", "service": "Dawa Info API"}

@router.get("/drug/{drug_name}/{language}")
def search_drug_language(drug_name: str, language: str = "en"):
    """Search drug with language support (en, am)"""
    drug = get_drug(drug_name)
    
    if not drug:
        return {"success": False, "error": "Drug not found"}
    
    # Return in Amharic
    if language == "am":
        return {
            "success": True,
            "name": drug.get("name_am", drug["name"]),
            "purpose": drug.get("purpose_am", drug["purpose"]),
            "side_effects": drug.get("side_effects_am", drug["side_effects"]),
            "age_limit": drug["age_limit"],
            "prescription": drug["prescription"],
            "warning": drug["warning"]
        }
    
    # Default English
    return {
        "success": True,
        "name": drug["name"],
        "purpose": drug["purpose"],
        "side_effects": drug["side_effects"],
        "age_limit": drug["age_limit"],
        "prescription": drug["prescription"],
        "warning": drug["warning"]
    }