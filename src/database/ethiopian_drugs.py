# src/database/ethiopian_drugs.py - Our drug database

# Simple dictionary of Ethiopian drugs
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
    }
}

def get_drug(name):
    """Get drug by name"""
    return DRUGS_DB.get(name.lower())

def search_drugs(query):
    """Search drugs containing query"""
    query = query.lower()
    results = {}
    for name, info in DRUGS_DB.items():
        if query in name or query in info['name'].lower():
            results[name] = info
    return results