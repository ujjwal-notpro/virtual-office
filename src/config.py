import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    HF_API_TOKEN = os.getenv("HF_API_TOKEN")
    HF_HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    WHISPER_MODEL_URL = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3"
    SUMMARIZER_MODEL_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

    APP_TITLE = "🎙️ AI Meeting Notes Generator"
    APP_ICON = "🎙️"
