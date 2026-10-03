import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API token from environment
    HF_API_TOKEN = os.getenv("HF_API_TOKEN")
    HF_HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    # API URLs
    WHISPER_MODEL_URL = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3"
    SUMMARIZER_MODEL_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

    # App settings
    APP_TITLE = "🎙️ AI Meeting Notes Generator"
    APP_ICON = "🎙️"
