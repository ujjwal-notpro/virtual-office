import requests
from src.config import Config


def transcribe_audio(audio_bytes):
    headers = {
        "Authorization": f"Bearer {Config.HF_API_TOKEN}",
        "Content-Type": "audio/mpeg"
    }

    response = requests.post(
        Config.WHISPER_MODEL_URL,
        headers=headers,
        data=audio_bytes
    )

    result = response.json()

    if "text" in result:
        text = result["text"]
        return text.strip()
    elif "error" in result:
        error = result["error"]
        if "loading" in str(error).lower():
            raise Exception("Model is loading, wait 20-30 seconds and try again")
        else:
            raise Exception(f"API error: {error}")
    else:
        raise Exception(f"Unexpected response: {result}")
