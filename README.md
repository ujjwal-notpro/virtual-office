# AI Meeting Notes Generator

This project transcribes meeting audio and generates AI summaries using Hugging Face models.

## Features

- Live audio recording from browser
- Upload MP3 files
- Speech-to-text using Whisper AI
- Automatic summarization using BART
- Download transcript and notes

## Tech Stack

- **Frontend**: Streamlit
- **Speech-to-Text**: OpenAI Whisper (via Hugging Face)
- **Summarization**: Facebook BART (via Hugging Face)
- **Language**: Python

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create `.env` file with your Hugging Face API token:
   ```
   HF_API_TOKEN=your_token_here
   ```
4. Run the app:
   ```bash
   streamlit run app.py
   ```

## How It Works

1. User records audio or uploads MP3 file
2. Audio is sent to Whisper API for transcription
3. Transcript is sent to BART API for summarization
4. Results are displayed in the UI

## Project Structure

```
src/
├── config.py         # API configuration
├── transcriber.py    # Speech-to-text module
├── summarizer.py     # Summarization module
└── ui_components.py  # UI helper functions

app.py                # Main Streamlit app
requirements.txt      # Dependencies
```

## Team

This is a group project for our college. I worked on the ML/AI part (transcription and summarization).
