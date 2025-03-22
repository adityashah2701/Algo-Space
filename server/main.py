import os
import cv2
import pytesseract
import tempfile
import logging
import time
import uuid
import re
import string
import spacy
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

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model not installed, download it
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Predefined skills list
SKILLS = [
    "React", "Node", "MongoDB", "Express", "Python", "Django", "Flask", 
    "Java", "C++", "C", "HTML", "CSS", "JavaScript", "TypeScript", 
    "Redux", "Context API", "REST API", "GraphQL", "SQL", "NoSQL", 
    "Firebase", "AWS", "Docker", "Kubernetes", "CI/CD", "Git", 
    "Agile", "Scrum", "Kanban", "TDD", "BDD", "Jest", "Mocha", 
    "Chai", "Cypress", "React Testing Library", "Jasmine", "Enzyme", 
    "Puppeteer", "Playwright", "Selenium", "WebdriverIO", "JIRA", 
    "Confluence", "Slack", "Trello", "Asana", "Postman", "Insomnia"
]

# Additional technical terms that might indicate skills
ADDITIONAL_TECH_TERMS = [
    "frontend", "backend", "fullstack", "full-stack", "web developer",
    "software engineer", "devops", "cloud", "database", "programming",
    "architecture", "microservices", "API", "server", "client",
    "machine learning", "AI", "data science", "analytics", "big data",
    "testing", "QA", "quality assurance", "UX", "UI", "user interface",
    "ETL", "data processing", "automation", "deployment", "web"
]

# Job roles with required skills
JOB_ROLES = [
    {
        "title": "Frontend Developer",
        "requiredSkills": ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
        "preferredSkills": ["Redux", "Jest", "Context API"],
        "description": "Build and maintain user interfaces and web applications"
    },
    {
        "title": "Backend Developer",
        "requiredSkills": ["Node", "Express", "SQL", "MongoDB", "API"],
        "preferredSkills": ["Python", "Django", "Flask", "Java", "Cloud"],
        "description": "Develop server-side logic and database architecture"
    },
    {
        "title": "Full Stack Developer",
        "requiredSkills": ["JavaScript", "React", "Node", "Express", "HTML", "CSS", "Git"],
        "preferredSkills": ["TypeScript", "MongoDB", "SQL", "Docker"],
        "description": "Handle both client and server-side development"
    },
    {
        "title": "DevOps Engineer",
        "requiredSkills": ["Docker", "Kubernetes", "CI/CD", "Git", "Cloud"],
        "preferredSkills": ["AWS", "Jenkins", "Terraform", "Ansible"],
        "description": "Implement and manage CI/CD pipelines and infrastructure"
    },
    {
        "title": "QA Engineer",
        "requiredSkills": ["Selenium", "Cypress", "Jest", "Testing", "QA"],
        "preferredSkills": ["Playwright", "Puppeteer", "API", "BDD", "TDD"],
        "description": "Develop and execute test plans and ensure software quality"
    }
]

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

def allowed_file(filename):
    """Check if file has an allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['pdf', 'png', 'jpg', 'jpeg']

def extract_skills_from_text(text, skills_list):
    """Extract skills from text using regex and NLP techniques"""
    detected_skills = []
    
    # Clean text - remove punctuation and extra whitespace
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Method 1: Simple regex matching for exact skills
    for skill in skills_list:
        try:
            # Create pattern to match whole words only
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                if skill not in detected_skills:
                    detected_skills.append(skill)
        except Exception as e:
            print(f"Error in regex for skill '{skill}': {str(e)}")
            # Fallback to simple case-insensitive containment check
            if skill.lower() in text.lower() and skill not in detected_skills:
                detected_skills.append(skill)
    
    # Method 2: NLP-based analysis
    try:
        doc = nlp(text)
        
        # Extract proper nouns and noun phrases that might be technology names
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT"]:
                for skill in skills_list:
                    if ent.text.lower() == skill.lower() and skill not in detected_skills:
                        detected_skills.append(skill)
        
        # Check for noun chunks that match skills
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.strip()
            for skill in skills_list:
                if chunk_text.lower() == skill.lower() and skill not in detected_skills:
                    detected_skills.append(skill)
    except Exception as e:
        logging.error(f"NLP error: {str(e)}")
    
    # Sort skills alphabetically for consistent output
    detected_skills.sort()
    
    return detected_skills

def generate_job_recommendations(detected_skills):
    """Generate job role recommendations based on detected skills"""
    if not detected_skills or len(detected_skills) == 0:
        return []
    
    # Calculate match percentage for each job role
    recommendations = []
    
    for job in JOB_ROLES:
        # Count matching required skills (case-insensitive)
        matching_required = [skill for skill in job["requiredSkills"] 
                            if any(s.lower() == skill.lower() for s in detected_skills)]
        
        # Count matching preferred skills (case-insensitive)
        matching_preferred = [skill for skill in job["preferredSkills"] 
                             if any(s.lower() == skill.lower() for s in detected_skills)]
        
        # Calculate match percentage - required skills have higher weight
        required_weight = 0.7
        preferred_weight = 0.3
        
        required_score = (len(matching_required) / len(job["requiredSkills"])) * required_weight if job["requiredSkills"] else 0
        preferred_score = (len(matching_preferred) / len(job["preferredSkills"])) * preferred_weight if job["preferredSkills"] else 0
        
        match_score = (required_score + preferred_score) * 100
        
        recommendations.append({
            "title": job["title"],
            "match": round(match_score),
            "requiredSkills": job["requiredSkills"],
            "preferredSkills": job["preferredSkills"],
            "matchingRequired": matching_required,
            "matchingPreferred": matching_preferred,
            "description": job["description"]
        })
    
    # Sort by match percentage (descending)
    recommendations.sort(key=lambda x: x["match"], reverse=True)
    
    return recommendations

@app.route('/ocr', methods=['POST'])
def process_file():
    """Handles file upload (image or PDF) and returns extracted text"""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    filename = file.filename.lower()
    
    if not file or not filename:
        return jsonify({"error": "Invalid file"}), 400
    
    if not allowed_file(filename):
        return jsonify({"error": "Invalid file type"}), 400
    
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

@app.route('/api/analyze-skills', methods=['POST'])
def analyze_skills():
    """Analyze text for skills and return skill analysis"""
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    
    # Custom skills list if provided
    custom_skills = data.get('skills', SKILLS)
    
    # Extract skills from text
    detected_skills = extract_skills_from_text(text, custom_skills)
    
    # Check for technical terms that might indicate technical skills
    tech_context = False
    for term in ADDITIONAL_TECH_TERMS:
        if term.lower() in text.lower():
            tech_context = True
            break
    
    # Generate job recommendations
    job_recommendations = generate_job_recommendations(detected_skills)
    
    # Return results
    result = {
        'detectedSkills': detected_skills,
        'skillCount': len(detected_skills),
        'hasTechnicalContext': tech_context,
        'jobRecommendations': job_recommendations,
        'metadata': {
            'textLength': len(text),
            'wordCount': len(text.split())
        }
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)