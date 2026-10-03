import requests
from src.config import Config


def transcribe_audio(audio_bytes):
    """
    Converts audio to text using Whisper AI model

    Steps:
    1. Takes audio bytes as input
    2. Sends to Hugging Face Whisper API
    3. Returns the transcribed text
    """

    # Prepare headers with API token
    headers = {
        "Authorization": f"Bearer {Config.HF_API_TOKEN}",
        "Content-Type": "audio/mpeg"  # for MP3 files
    }

    # Send audio to Whisper API
    response = requests.post(
        Config.WHISPER_MODEL_URL,
        headers=headers,
        data=audio_bytes,
    )

    # Get response from API
    result = response.json()

    # Check if transcription was successful
    if "text" in result:
        return result["text"].strip()
    elif "error" in result:
        error_msg = result['error']
        if "loading" in str(error_msg).lower():
            raise Exception(
                "Model is loading. Please wait 20-30 seconds and try again."
            )
        raise Exception(f"API error: {error_msg}")
    else:
        raise Exception(f"Unexpected response: {result}")
