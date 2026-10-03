import requests
from src.config import Config


def summarize_text(transcript):
    """
    Creates a summary from meeting transcript using BART AI model

    Steps:
    1. Takes transcript text as input
    2. Sends to Hugging Face BART API
    3. Returns formatted meeting summary
    """

    # Send transcript to BART API for summarization
    response = requests.post(
        Config.SUMMARIZER_MODEL_URL,
        headers=Config.HF_HEADERS,
        json={
            "inputs": transcript,
            "parameters": {
                "max_length": 200,
                "min_length": 30,
                "do_sample": False,
            }
        },
    )

    # Get response from API
    result = response.json()

    # Check if summarization was successful
    if isinstance(result, list) and len(result) > 0:
        summary = result[0].get("summary_text", "No summary generated.")
        return create_formatted_notes(summary, transcript)
    elif isinstance(result, dict) and "error" in result:
        error_msg = result['error']
        if "loading" in error_msg.lower():
            raise Exception(
                "Model is loading. Please wait 20-30 seconds and try again."
            )
        raise Exception(f"API error: {error_msg}")
    else:
        raise Exception(f"Unexpected response: {result}")


def create_formatted_notes(summary, transcript):
    """
    Formats the summary into structured meeting notes
    """

    # Calculate basic statistics
    word_count = len(transcript.split())
    estimated_duration = word_count // 150  # Average speaking rate

    # Split transcript into sentences
    sentences = [s.strip() for s in transcript.split('.') if s.strip()]

    # Create formatted output
    formatted_notes = f"""## 📋 Meeting Summary

{summary}

---

### 📊 Meeting Statistics
- **Total Words**: {word_count}
- **Estimated Duration**: ~{estimated_duration} minutes
- **Total Sentences**: {len(sentences)}

---

### 💬 Key Points Discussed

"""

    # Add first 3 sentences as key points
    for i, sentence in enumerate(sentences[:3], 1):
        formatted_notes += f"{i}. {sentence}.\n"

    formatted_notes += """
---

### ⚠️ Note
This summary was generated using AI. Please review the raw transcript for complete accuracy.
"""

    return formatted_notes
