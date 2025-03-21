import os
import cv2
import pytesseract
import tempfile
import logging
import time
import uuid
from pdf2image import convert_from_path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Set Tesseract path (Windows users only, remove for Linux/macOS)
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

# Set Poppler path (Windows users only, remove for Linux/macOS)
POPPLER_PATH = r"C:\\Users\\DELL\\Downloads\\Release-24.08.0-0\\poppler-24.08.0\\Library\\bin"

def ocr_extract(image):
    """Extracts text from an image using Tesseract OCR"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return pytesseract.image_to_string(gray)

def process_pdf(pdf_path):
    """Converts a PDF to images and extracts text from each page"""
    try:
        images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
        text_output = []
        
        # Create a unique directory for temporary files
        temp_dir = os.path.join(tempfile.gettempdir(), f"ocr_temp_{uuid.uuid4().hex}")
        os.makedirs(temp_dir, exist_ok=True)
        
        try:
            for i, image in enumerate(images):
                # Use a unique filename for each image
                temp_img_path = os.path.join(temp_dir, f"page_{i}.png")
                
                # Save image
                image.save(temp_img_path, "PNG")
                
                # Process image
                image_cv = cv2.imread(temp_img_path)
                extracted_text = ocr_extract(image_cv)
                text_output.append(extracted_text)
                
                # Remove the temporary image file immediately after processing
                try:
                    os.remove(temp_img_path)
                except Exception as e:
                    logging.warning(f"Could not remove temporary image: {str(e)}")
        finally:
            # Attempt to clean up the temp directory
            try:
                # Wait briefly to ensure files are no longer in use
                time.sleep(0.1)
                os.rmdir(temp_dir)
            except Exception as e:
                logging.warning(f"Could not remove temporary directory: {str(e)}")
        
        return "\n".join(text_output)
    except Exception as e:
        logging.error(f"Error processing PDF: {str(e)}")
        return f"Error processing PDF: {str(e)}"

@app.route('/ocr', methods=['POST'])
def process_file():
    """Handles file upload (image or PDF) and returns extracted text"""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    filename = file.filename.lower()
    
    # Generate a unique temp file name
    temp_file_path = os.path.join(tempfile.gettempdir(), f"ocr_upload_{uuid.uuid4().hex}")
    
    try:
        # Save uploaded file to temp location
        file.save(temp_file_path)
        
        # Process the file
        if filename.endswith(".pdf"):
            extracted_text = process_pdf(temp_file_path)
        elif filename.endswith(('.png', '.jpg', '.jpeg')):
            image = cv2.imread(temp_file_path)
            extracted_text = ocr_extract(image)
        else:
            return jsonify({"error": "Invalid file type"}), 400
        
        return jsonify({"text": extracted_text})
    except Exception as e:
        logging.error(f"Error processing file: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temp file
        try:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        except Exception as e:
            logging.warning(f"Could not remove temporary file: {str(e)}")

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)