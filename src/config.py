import os
from dotenv import load_dotenv

# Load API token from .env file
load_dotenv()


class Config:
    # Hugging Face API Token
    HF_API_TOKEN = os.getenv("HF_API_TOKEN")
    HF_HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    # Hugging Face Models
    WHISPER_MODEL_URL = (
        "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3"
    )
    SUMMARIZER_MODEL_URL = (
        "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
    )

    # App Details
    APP_TITLE = "🎙️ AI Meeting Notes Generator"
    APP_ICON = "🎙️"
