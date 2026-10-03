import requests
from src.config import Config


def summarize_text(transcript):
    # send transcript to bart model for summarization
    response = requests.post(
        Config.SUMMARIZER_MODEL_URL,
        headers=Config.HF_HEADERS,
        json={
            "inputs": transcript,
            "parameters": {
                "max_length": 200,
                "min_length": 30,
                "do_sample": False
            }
        }
    )

    result = response.json()

    # check response
    if isinstance(result, list) and len(result) > 0:
        summary = result[0].get("summary_text", "No summary generated")
        # format and return
        return format_notes(summary, transcript)
    elif isinstance(result, dict) and "error" in result:
        error = result["error"]
        if "loading" in error.lower():
            raise Exception("Model is loading, wait and try again")
        else:
            raise Exception(f"API error: {error}")
    else:
        raise Exception(f"Unexpected response: {result}")


def format_notes(summary, transcript):
    # calculate some stats
    words = transcript.split()
    word_count = len(words)
    duration = word_count // 150

    # split into sentences
    sentences = transcript.split('.')
    sentences = [s.strip() for s in sentences if s.strip()]

    # build the output
    output = "## 📋 Meeting Summary\n\n"
    output += summary
    output += "\n\n---\n\n"
    output += "### 📊 Meeting Statistics\n"
    output += f"- **Total Words**: {word_count}\n"
    output += f"- **Estimated Duration**: ~{duration} minutes\n"
    output += f"- **Total Sentences**: {len(sentences)}\n"
    output += "\n---\n\n"
    output += "### 💬 Key Points Discussed\n\n"

    # add first 3 sentences as key points
    count = 0
    for sentence in sentences:
        if count >= 3:
            break
        output += f"{count+1}. {sentence}.\n"
        count += 1

    output += "\n---\n\n"
    output += "### ⚠️ Note\n"
    output += "This summary was generated using AI. Please review the raw transcript for complete accuracy.\n"

    return output
