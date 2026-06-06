# src/main.py - COMPLETE VERSION WITH OCR SUPPORT

from fastapi import FastAPI, UploadFile, File # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

# ========== OCR IMPORTS ==========
import pytesseract # type: ignore
from PIL import Image
import io

# ========== CREATE APP FIRST ==========
app = FastAPI(title="Dawa Info API", description="Drug safety for Ethiopia")

# ========== ADD MIDDLEWARE ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== DRUG DATABASE ==========
DRUGS_DB = {
    "paracetamol": {
        "name": "Paracetamol",
        "name_am": "ፓራሲታሞል",
        "purpose": "Fever and pain relief",
        "purpose_am": "ትኩሳት እና ህመም ማስታገሻ",
        "side_effects": "Liver damage if overdose",
        "side_effects_am": "ከመጠን በላይ ከወሰዱ ጉበት ሊጎዳ ይችላል",
        "age_limit": "Adults: 500mg/4-6h",
        "prescription": False,
        "warning": "Stop if: severe stomach pain, yellow eyes"
    },
    "amoxicillin": {
        "name": "Amoxicillin",
        "name_am": "አሞክሲሲሊን",
        "purpose": "Bacterial infections",
        "purpose_am": "የባክቴሪያ ኢንፌክሽን",
        "side_effects": "Diarrhea, nausea",
        "side_effects_am": "ተቅማጥ፣ ማቅለሽለሽ",
        "age_limit": "Adults: 500mg 3x daily",
        "prescription": True,
        "warning": "Stop if: severe rash, difficulty breathing"
    },
    "ibuprofen": {
        "name": "Ibuprofen",
        "name_am": "አይቡፕሮፌን",
        "purpose": "Pain, fever, inflammation",
        "purpose_am": "ህመም፣ ትኩሳት፣ እብጠት",
        "side_effects": "Stomach pain, heartburn",
        "side_effects_am": "የሆድ ህመም፣ ማቃጠል",
        "age_limit": "Adults only, not for children under 12",
        "prescription": False,
        "warning": "Stop if: black stools, chest pain"
    },
    "doxycycline": {
        "name": "Doxycycline",
        "name_am": "ዶክሲሳይክሊን",
        "purpose": "Bacterial infections, malaria prevention",
        "purpose_am": "የባክቴሪያ ኢንፌክሽን፣ ወባ መከላከያ",
        "side_effects": "Sun sensitivity, upset stomach",
        "side_effects_am": "ለፀሀይ ስሜታዊነት፣ የሆድ ምታት",
        "age_limit": "Not for children under 8",
        "prescription": True,
        "warning": "Stop if: severe headache, vision changes"
    },
    "metformin": {
        "name": "Metformin",
        "name_am": "ሜትፎርሚን",
        "purpose": "Type 2 diabetes",
        "purpose_am": "የስኳር በሽታ",
        "side_effects": "Nausea, metallic taste",
        "side_effects_am": "ማቅለሽለሽ፣ የብረት ጣዕም",
        "age_limit": "Adults only",
        "prescription": True,
        "warning": "Stop if: muscle pain, extreme tiredness"
    },
    "ciprofloxacin": {
        "name": "Ciprofloxacin",
        "name_am": "ሲፕሮፍሎክሳሲን",
        "purpose": "Urinary tract infections",
        "purpose_am": "የሽንት ቱቦ ኢንፌክሽን",
        "side_effects": "Nausea, diarrhea",
        "side_effects_am": "ማቅለሽለሽ፣ ተቅማጥ",
        "age_limit": "Adults only",
        "prescription": True,
        "warning": "Stop if: tendon pain, nerve damage"
    },
    "omeprazole": {
        "name": "Omeprazole",
        "name_am": "ኦሜፕራዞል",
        "purpose": "Stomach acid, heartburn",
        "purpose_am": "የሆድ አሲድ፣ ማቃጠል",
        "side_effects": "Headache, constipation",
        "side_effects_am": "ራስ ምታት፣ የሆድ መደፈን",
        "age_limit": "Adults: 20mg daily",
        "prescription": False,
        "warning": "Stop if: severe stomach pain, rash"
    }
}

def get_drug(name):
    return DRUGS_DB.get(name.lower())

# ========== ENDPOINTS ==========

@app.get("/")
def home():
    return {
        "message": "Dawa Info API is running! 🚀",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "search": "/drug/{name}",
            "search_with_lang": "/drug/{name}/{lang}",
            "all_drugs": "/drugs",
            "scan": "POST /scan"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Dawa Info API",
        "version": "1.0.0",
        "drugs_available": len(DRUGS_DB)
    }

@app.get("/test")
def test():
    return {"success": True, "message": "API is working!"}

@app.get("/drugs")
def list_drugs():
    """List all available drugs"""
    return {
        "count": len(DRUGS_DB),
        "drugs": list(DRUGS_DB.keys())
    }

@app.get("/drug/{drug_name}")
def search_drug(drug_name: str):
    """Search drug by name (English)"""
    drug = get_drug(drug_name)
    
    if drug:
        return {"success": True, "data": drug}
    else:
        return {
            "success": False,
            "error": f"Drug '{drug_name}' not found",
            "suggestions": list(DRUGS_DB.keys())
        }

@app.get("/drug/{drug_name}/{language}")
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

# ========== SCAN ENDPOINT WITH OCR ==========
@app.post("/scan")
async def scan_drug_photo(file: UploadFile = File(...)):
    """Upload drug photo to identify using OCR"""
    
    try:
        # Read the uploaded image
        contents = await file.read()
        
        # Check if file is empty
        if len(contents) == 0:
            return {
                "success": False,
                "error": "Empty file received"
            }
        
        # Open image with PIL
        image = Image.open(io.BytesIO(contents))
        
        # Convert to grayscale for better OCR
        if image.mode != 'L':
            image = image.convert('L')
        
        # Extract text from image using Tesseract
        try:
            extracted_text = pytesseract.image_to_string(image).lower()
        except Exception as e:
            return {
                "success": False,
                "error": f"OCR failed: {str(e)}",
                "message": "Make sure Tesseract is installed. Run: sudo apt install tesseract-ocr"
            }
        
        print(f"📝 OCR Extracted: {extracted_text[:100]}")  # Debug in terminal
        
        # Look for drug names in the extracted text
        found_drug = None
        for drug_name in DRUGS_DB.keys():
            if drug_name in extracted_text:
                found_drug = drug_name
                break
        
        # Also check for partial matches
        if not found_drug:
            for drug_name in DRUGS_DB.keys():
                if drug_name[:5] in extracted_text or drug_name in extracted_text[:50]:
                    found_drug = drug_name
                    break
        
        if found_drug:
            drug_info = DRUGS_DB[found_drug]
            return {
                "success": True,
                "detected_drug": found_drug,
                "drug_info": drug_info,
                "detected_text": extracted_text[:200] if extracted_text else "No text detected"
            }
        else:
            return {
                "success": False,
                "error": "No matching drug found in the photo",
                "detected_text": extracted_text[:200] if extracted_text else "No text detected",
                "suggestion": "Try taking a clearer photo of the medicine package or search by name",
                "available_drugs": list(DRUGS_DB.keys())
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Scan failed: {str(e)}"
        }

# ========== RUN SERVER ==========
# Command: uvicorn src.main:app --reload --port 8000