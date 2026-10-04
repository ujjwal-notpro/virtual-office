# ML API

A simple FastAPI API that turns an audio file into meeting notes.

## How it works

Audio → Whisper → Transcript → BART → Summary

1. You send an audio file to the API.
2. Whisper (speech-to-text) turns the audio into a transcript.
3. BART (text summarization) turns the transcript into a summary.
4. The API returns both the transcript and the summary.

## Endpoint

```
POST /meeting-summary
```

### Input

`multipart/form-data` with one field:

| Field | Type | Required |
|-------|------|----------|
| `file` | audio file (e.g. `.mp3`) | Yes |

### Output

```json
{
  "transcript": "...",
  "summary": "..."
}
```

- `transcript` — the full text of what was said in the audio.
- `summary` — the meeting notes, in Markdown.

## Example: how to send an audio file

### Python (using `requests`)

```python
import requests

url = "http://localhost:8000/meeting-summary"

with open("meeting.mp3", "rb") as f:
    response = requests.post(url, files={"file": f})

result = response.json()
print(result["transcript"])
print(result["summary"])
```

### cURL

```bash
curl -X POST http://localhost:8000/meeting-summary -F "file=@meeting.mp3"
```

## Running locally

Start the ML API:

```bash
python main.py
```

If both services (your backend and this ML API) are running on the **same computer**, the backend can call:

```
http://localhost:8000/meeting-summary
```

If they are on **different computers**, use the ML API machine's local network IP instead, e.g. `http://192.168.1.5:8000/meeting-summary`.

## Other endpoints

- `GET /` — health check, returns `{"message": "ML API is working"}`
- `POST /transcribe` — audio file in → `{"transcript": "..."}`
- `POST /summarize` — `{"transcript": "..."}` in → `{"summary": "..."}`
