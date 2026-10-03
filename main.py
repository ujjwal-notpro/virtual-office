import os
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()


client = OpenAI(api_key=os.getenv(""))

app = FastAPI(
    title="AI Meeting Summarizer API",
    description="API for transcribing and summarizing meeting audio",
    version="1.0.0")
