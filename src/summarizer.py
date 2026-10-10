from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from src.config import Config

# Load the model and tokenizer only once
print(f"Loading Summarizer model: {Config.SUMMARIZER_MODEL}...")
# Use cpu for now, as cuda check failed
model = AutoModelForSeq2SeqLM.from_pretrained(Config.SUMMARIZER_MODEL)
tokenizer = AutoTokenizer.from_pretrained(Config.SUMMARIZER_MODEL)
print("Summarizer loaded successfully.")

def summarize_text(transcript):
    """
    Summarizes text using a local BART model.
    """
    try:
        # Prepare inputs
        inputs = tokenizer(
            transcript,
            return_tensors='pt',
            max_length=1024,
            truncation=True
        )

        # Generate summary
        summary_ids = model.generate(
            inputs['input_ids'],
            num_beams=4,
            max_length=200,
            min_length=30,
            early_stopping=True
        )

        summary = tokenizer.decode(
            summary_ids[0],
            skip_special_tokens=True
        )

        return format_notes(summary, transcript)

    except Exception as e:
        raise Exception(f"Summarization failed: {str(e)}")

def format_notes(summary, transcript):
    words = transcript.split()
    word_count = len(words)
    duration = word_count // 150

    sentences = transcript.split('.')
    sentences = [s.strip() for s in sentences if s.strip()]

    output = "## 📋 Meeting Summary\n\n"
    output += summary
    output += "\n\n---\n\n"
    output += "### 📊 Meeting Statistics\n"
    output += f"- **Total Words**: {word_count}"
    output += f"\n- **Estimated Duration**: ~{duration} minutes"
    output += f"\n- **Total Sentences**: {len(sentences)}"
    output += "\n\n---\n\n"
    output += "### 💬 Key Points Discussed\n\n"

    # add first 3 sentences as key points
    count = 0
    for sentence in sentences:
        if count >= 3:
            break
        output += f"{count+1}. {sentence}.\n"
        count += 1

    output += "\n\n---\n\n"
    output += "### ⚠️ Note\n"
    output += "This summary was generated using AI. Please review the raw transcript for complete accuracy.\n"

    return output
