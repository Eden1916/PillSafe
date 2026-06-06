# test_setup.py - Verify everything works

import sys
print("Python version:", sys.version)

# Test imports
try:
    import fastapi # type: ignore
    print("✅ FastAPI installed")
except:
    print("❌ FastAPI missing")

try:
    import pytesseract # type: ignore
    print("✅ Tesseract installed")
except:
    print("❌ Tesseract missing")

try:
    from PIL import Image
    print("✅ Pillow installed")
except:
    print("❌ Pillow missing")

print("\n🎯 Setup complete! Ready to code.")