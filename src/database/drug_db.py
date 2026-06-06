# src/database/drugs_data.py - All drug data in one place

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
    """Get drug by name"""
    return DRUGS_DB.get(name.lower())

def get_all_drugs():
    """Get all drug names"""
    return list(DRUGS_DB.keys())