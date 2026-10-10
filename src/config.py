import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Using lightweight local models
    WHISPER_MODEL = "tiny.en"
    SUMMARIZER_MODEL = "sshleifer/distilbart-cnn-12-6"

    APP_TITLE = "🎙️ AI Meeting Notes Generator"
    APP_ICON = "🎙️"
