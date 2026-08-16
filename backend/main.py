from fastapi import FastAPI, UploadFile
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from pypdf import PdfReader
from fastapi.middleware.cors import CORSMiddleware
import os 
import io

load_dotenv()

app = FastAPI()
client= OpenAI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



class TailorRequest(BaseModel):
    resume_text:str
    job_description: str

@app.post("/tailor")
def rtailor_resume(request: TailorRequest):
   prompt = f"""You are a resume writer.
     Below is a candidate's actual resume and an actual job description they're applying to.
     Resume:{request.resume_text}
     Job Description:{request.job_description}
    Your task : rewrite and reorganize the resume to better match this job description.
    
    Rules:
    - rewrite the resume into an ATS format
    - Emphasize the areas in the resume that matches the job description
    - Only reorder, re-emphasize, or rephrease content that already exists in the resume- do not add new jobs, skills, metrics, or credentials
    """
   response=client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": prompt}
    ]
 )
   return {"tailored_resume" : response.choices[0].message.content}



@app.post("/upload")
async def upload_resume(file: UploadFile):
    contents = await file.read()
    pdf = PdfReader(io.BytesIO(contents))

    text=""
    for page in pdf.pages:
        text += page.extract_text()

    return {"extracted_text": text}


class CoverLetterResponse(BaseModel):
    greeting: str
    opening_paragraph: str
    body_paragraphs: list[str]
    closing_paragraph: str
    signoff: str 

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str
    role_title: str

@app.post("/cover-letter")
def generate_cover_letter(request: CoverLetterRequest):
    prompt = f"""You are a professional cover letter writer.

Below is a candidate's resume and the job they're applying to.

Resume:
{request.resume_text}

Job Description:
{request.job_description}

Company: {request.company_name}
Role: {request.role_title}

Write a compelling, personalized cover letter. Rules:
- Only reference experience, skills, and facts present in the resume — do not invent anything
- Keep tone professional but not generic or robotic
- Make the opening paragraph specific to this company/role, not a template
"""

    response = client.beta.chat.completions.parse(   # which method — not .create() this time
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format= CoverLetterResponse   # what goes here — think about what you're asking it to match
    )

    return response.choices[0].message.parsed   # what attribute holds the already-parsed object
