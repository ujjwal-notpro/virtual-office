import whisper
import tempfile
import os
from src.config import Config

# Load the model only once when this module is imported
print(f"Loading Whisper model: {Config.WHISPER_MODEL}...")
model = whisper.load_model(Config.WHISPER_MODEL)
print("Whisper model loaded successfully.")

def transcribe_audio(audio_bytes):
    """
    Transcribes audio bytes to text using a local Whisper model.
    """
    # Create a temporary file to store the audio bytes
    # Whisper needs a file path, not bytes
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
        temp_file.write(audio_bytes)
        temp_file_path = temp_file.name

    try:
        # Perform transcription
        result = model.transcribe(temp_file_path)
        return result["text"].strip()

    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")

    finally:
        # Ensure temporary file is deleted
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
