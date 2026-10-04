from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

from src.transcriber import transcribe_audio
from src.summarizer import summarize_text

app = FastAPI()


class SummaryInput(BaseModel):
    transcript: str


@app.post("/summarize")
async def summarize(input: SummaryInput):
    
    summary = summarize_text(input.transcript)
    return {"summary": summary}


@app.get("/")
def read_root():
    return {"message": "ML API is working"}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    
    audio_bytes = await file.read()

   
    transcript = transcribe_audio(audio_bytes)

    return {"transcript": transcript}


@app.post("/meeting-summary")
async def meeting_summary(file: UploadFile = File(...)):
    # Read audio file
    audio_bytes = await file.read()

    # Step 1: Transcribe using existing Whisper function
    transcript = transcribe_audio(audio_bytes)

    # Step 2: Summarize using existing BART function
    summary = summarize_text(transcript)

    # Return both results
    return {"transcript": transcript, "summary": summary}