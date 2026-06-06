# src/services/ocr_service.py - OCR processing

import pytesseract # type: ignore
from PIL import Image
import io

class OCRService:
    def __init__(self):
        # For Linux (usually auto-detected)
        # If not working, uncomment:
        # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
        pass
    
    def extract_text(self, image_bytes):
        """Extract text from drug package image"""
        try:
            # Open image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to grayscale for better OCR
            if image.mode != 'L':
                image = image.convert('L')
            
            # Extract text
            text = pytesseract.image_to_string(image)
            
            return text.lower().strip()
        except Exception as e:
            print(f"OCR Error: {e}")
            return ""