# 🎙️ AI Meeting Notes Generator - Workflow Diagram

## 📊 System Overview (Beginner-Friendly)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Meeting Notes Generator                    │
│         (Record → Transcribe → Summarize → Download)            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Main Workflow (Step-by-Step)

```
┌──────────────┐
│   👤 USER    │
│  Opens App   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: 🎤 AUDIO RECORDING                                     │
│  ┌────────────────────────────────────────┐                     │
│  │  User clicks "Start Recording" button  │                     │
│  │  → Browser mic captures audio          │                     │
│  │  → User clicks "Stop"                  │                     │
│  │  → Audio saved as bytes in memory      │                     │
│  └────────────────────────────────────────┘                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: 🗣️ SPEECH-TO-TEXT (Transcription)                     │
│  ┌────────────────────────────────────────┐                     │
│  │  Audio Bytes                           │                     │
│  │        ↓                               │                     │
│  │  transcriber.py                        │                     │
│  │        ↓                               │                     │
│  │  Hugging Face Whisper API              │                     │
│  │  (Model: openai/whisper-large-v3)      │                     │
│  │        ↓                               │                     │
│  │  📝 Raw Text Transcript                │                     │
│  └────────────────────────────────────────┘                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: 📄 AI SUMMARIZATION                                    │
│  ┌────────────────────────────────────────┐                     │
│  │  Raw Transcript Text                   │                     │
│  │        ↓                               │                     │
│  │  summarizer.py                         │                     │
│  │        ↓                               │                     │
│  │  Hugging Face BART API                 │                     │
│  │  (Model: facebook/bart-large-cnn)      │                     │
│  │        ↓                               │                     │
│  │  📋 Structured Meeting Notes           │                     │
│  │  (Summary + Key Points + Action Items) │                     │
│  └────────────────────────────────────────┘                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: 📱 DISPLAY RESULTS                                     │
│  ┌─────────────────────┬──────────────────┐                     │
│  │  📝 Tab 1:          │  📄 Tab 2:       │                     │
│  │  Raw Transcript     │  Meeting Notes   │                     │
│  │  (Full text)        │  (AI Summary)    │                     │
│  └─────────────────────┴──────────────────┘                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: 💾 DOWNLOAD OPTIONS                                    │
│  ┌────────────────────────────────────────┐                     │
│  │  User can download:                    │                     │
│  │  • 🎵 Audio file (.wav)                │                     │
│  │  • 📝 Transcript (.txt)                │                     │
│  │  • 📄 Meeting Notes (.txt)             │                     │
│  └────────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture (Technical View)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Streamlit Web App                       │  │
│  │                      (app.py)                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
             ▼                                    ▼
┌────────────────────────┐          ┌────────────────────────────┐
│   UI COMPONENTS        │          │   CONFIGURATION           │
│  (ui_components.py)    │          │    (config.py)            │
│                        │          │                           │
│ • Session State        │          │ • HF API Token            │
│ • Display Functions    │          │ • Model URLs              │
│ • Download Buttons     │          │ • App Settings            │
└────────────────────────┘          └────────────────────────────┘
             │
             │
┌────────────┴────────────────────────────────────────────────────┐
│                      PROCESSING LAYER                           │
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   TRANSCRIBER        │         │    SUMMARIZER        │     │
│  │  (transcriber.py)    │         │   (summarizer.py)    │     │
│  │                      │         │                      │     │
│  │  Input: Audio bytes  │────────▶│  Input: Text         │     │
│  │  Output: Text        │         │  Output: Summary     │     │
│  └──────────┬───────────┘         └───────────┬──────────┘     │
│             │                                 │                 │
└─────────────┼─────────────────────────────────┼─────────────────┘
              │                                 │
              ▼                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL AI LAYER                          │
│                    (Hugging Face API)                           │
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │  Whisper Model       │         │    BART Model        │     │
│  │  (Speech-to-Text)    │         │  (Summarization)     │     │
│  │                      │         │                      │     │
│  │ openai/whisper-      │         │ facebook/bart-       │     │
│  │ large-v3             │         │ large-cnn            │     │
│  └──────────────────────┘         └──────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure & Data Flow

```
Project Root
│
├── .env                    ← 🔑 Contains HF_API_TOKEN
│
├── app.py                  ← 🚀 ENTRY POINT
│   │                          • Loads Streamlit UI
│   │                          • Handles user interactions
│   │                          • Coordinates all components
│   ↓
├── src/
│   ├── config.py           ← ⚙️ CONFIGURATION
│   │                          • Reads .env file
│   │                          • Sets up API token
│   │                          • Defines model URLs
│   │
│   ├── ui_components.py    ← 🎨 UI COMPONENTS
│   │                          • Session state management
│   │                          • Display functions
│   │                          • Download buttons
│   │
│   ├── transcriber.py      ← 🎤 STEP 1: AUDIO → TEXT
│   │                          Input:  Audio bytes
│   │                          API:    Whisper
│   │                          Output: Raw transcript
│   │
│   └── summarizer.py       ← 📝 STEP 2: TEXT → SUMMARY
│                              Input:  Transcript text
│                              API:    BART
│                              Output: Meeting notes
```

---

## 🔄 Data Flow (Simplified)

```
Audio Recording (Browser)
        │
        │ (Audio Bytes)
        ▼
┌──────────────────┐
│ transcriber.py   │  → API Call → Hugging Face Whisper
└────────┬─────────┘
         │
         │ (Transcript Text)
         ▼
┌──────────────────┐
│  summarizer.py   │  → API Call → Hugging Face BART
└────────┬─────────┘
         │
         │ (Meeting Notes)
         ▼
┌──────────────────┐
│  Display in UI   │
│  + Download      │
└──────────────────┘
```

---

## 🎯 Key Components Explained (For Beginners)

### 1️⃣ **Frontend (What User Sees)**
- **Tool**: Streamlit
- **File**: `app.py`
- **Purpose**: Creates the web interface with buttons, tabs, and displays

### 2️⃣ **Audio Capture**
- **Tool**: streamlit-mic-recorder
- **Purpose**: Records audio from user's microphone in the browser

### 3️⃣ **Speech-to-Text (Transcription)**
- **File**: `transcriber.py`
- **AI Model**: Whisper (by OpenAI, hosted on Hugging Face)
- **Input**: Audio file (bytes)
- **Output**: Text transcript

### 4️⃣ **Summarization**
- **File**: `summarizer.py`
- **AI Model**: BART (by Facebook, hosted on Hugging Face)
- **Input**: Text transcript
- **Output**: Structured meeting notes with summary and action items

### 5️⃣ **Configuration**
- **File**: `config.py`
- **Purpose**: Stores API tokens, model URLs, and app settings

### 6️⃣ **UI Components**
- **File**: `ui_components.py`
- **Purpose**: Reusable functions for displaying data and handling downloads

---

## 🔐 Authentication Flow

```
App Startup
     │
     ▼
Load .env file
     │
     ▼
Read HF_API_TOKEN
     │
     ▼
Pass token to API calls
     │
     ├─→ Whisper API (with token)
     │
     └─→ BART API (with token)
```

---

## ⚡ Request-Response Flow

```
USER ACTION                    SYSTEM RESPONSE
────────────                   ─────────────────

1. Click "Start Recording"  →  Mic activates
                                
2. Speak into mic           →  Audio captured in browser
                                
3. Click "Stop"             →  Audio saved as bytes
                                
4. Click "Generate Notes"   →  Processing starts...
                                
   4a. Audio → Whisper API  →  Transcript generated ✅
                                
   4b. Text → BART API      →  Summary generated ✅
                                
5. View in tabs             →  Results displayed
                                
6. Click download buttons   →  Files downloaded 💾
```

---

## 🧩 Module Dependencies

```
app.py
  │
  ├── imports → streamlit
  ├── imports → streamlit_mic_recorder
  │
  ├── imports → src.config (Config)
  ├── imports → src.transcriber (transcribe_audio)
  ├── imports → src.summarizer (summarize_text)
  └── imports → src.ui_components (all UI functions)

src/transcriber.py
  │
  ├── imports → requests (for API calls)
  ├── imports → io (for audio handling)
  └── uses → Config.HF_API_TOKEN

src/summarizer.py
  │
  ├── imports → requests (for API calls)
  └── uses → Config.HF_API_TOKEN

src/config.py
  │
  ├── imports → os
  └── imports → dotenv (load_dotenv)
```

---

## 🎨 UI Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                   AI Meeting Notes Generator                │
│              (Record → Transcribe → Summarize)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────┬──────────────────────────────┐  │
│  │  LEFT COLUMN          │  RIGHT COLUMN                │  │
│  │  (Audio Recording)    │  (Results Display)           │  │
│  │                       │                              │  │
│  │  📍 Section 1:        │  📍 Section 2:               │  │
│  │  Capture Audio        │  Transcripts & AI Insights   │  │
│  │                       │                              │  │
│  │  🎤 Mic Recorder      │  ┌─────────┬──────────────┐  │  │
│  │  [Start Recording]    │  │ Tab 1   │   Tab 2      │  │  │
│  │                       │  │ Raw     │   Meeting    │  │  │
│  │  🎵 Audio Player      │  │ Trans-  │   Notes      │  │  │
│  │  (after recording)    │  │ cript   │   (Summary)  │  │  │
│  │                       │  └─────────┴──────────────┘  │  │
│  │  ✨ [Generate Notes]  │                              │  │
│  │                       │                              │  │
│  └───────────────────────┴──────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  📍 Section 3: Download & Save Center                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💾 [Download Audio]  [Download Transcript]  [...]  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Execution Timeline

```
Time    Event                           Status
────    ─────────────────────────────   ──────────────────
0:00    User opens app                  ✅ App loaded
0:05    User clicks "Start Recording"   🎤 Recording...
0:35    User clicks "Stop"              ✅ Audio captured
0:37    User clicks "Generate Notes"    ⏳ Processing...
0:40    Whisper API called              🔄 Transcribing...
0:55    Transcript received             ✅ Step 1 complete
0:57    BART API called                 🔄 Summarizing...
1:10    Summary received                ✅ Step 2 complete
1:11    Results displayed               ✅ Done!
```

---

## 📚 Tech Stack Summary

| Layer              | Technology                    | Purpose                  |
|--------------------|-------------------------------|--------------------------|
| **Frontend**       | Streamlit                     | Web UI                   |
| **Audio Capture**  | streamlit-mic-recorder        | Browser-based recording  |
| **Speech-to-Text** | Whisper (Hugging Face)        | Audio → Text             |
| **Summarization**  | BART (Hugging Face)           | Text → Summary           |
| **Language**       | Python 3.x                    | Backend logic            |
| **API Client**     | requests library              | HTTP calls to HF         |
| **Environment**    | python-dotenv                 | Manage secrets           |

---

## 💡 Key Concepts for Beginners

### What is an API?
- **A**pplication **P**rogramming **I**nterface
- A way to use someone else's service (like Hugging Face's AI models)
- You send data → API processes it → You get results

### What is Hugging Face?
- A platform that hosts AI models
- Provides free API access to models like Whisper and BART
- Requires an API token (like a password) to use

### What is Whisper?
- An AI model that converts speech to text
- Created by OpenAI
- Very accurate for transcription

### What is BART?
- An AI model for text summarization
- Created by Facebook/Meta
- Good at creating short summaries from long text

---

## 🎓 How Each File Works (Beginner Explanation)

### `config.py` - The Settings Manager
```
Loads the .env file → Gets your API token → Stores it for other files to use
```

### `transcriber.py` - The Listener
```
Gets audio bytes → Sends to Whisper API → Returns text transcript
```

### `summarizer.py` - The Note Taker
```
Gets transcript text → Sends to BART API → Returns meeting summary
```

### `ui_components.py` - The Display Helper
```
Creates reusable functions for showing data and download buttons
```

### `app.py` - The Conductor
```
Brings everything together → Handles user clicks → Shows results
```

---

## ✅ Success Indicators

```
✓ User can record audio
✓ Audio is transcribed to text
✓ Text is summarized to meeting notes
✓ Results are displayed in tabs
✓ Files can be downloaded
```

---

## 📝 Notes for Your Senior

- **Architecture**: Modular design with separation of concerns
- **Scalability**: Can easily add new AI models or features
- **Security**: API token stored in .env (not in code)
- **User Experience**: Real-time feedback with spinners and status messages
- **Error Handling**: Try-catch blocks for API failures
- **Free Tier**: Uses free Hugging Face API (no OpenAI costs)

---

**Created for**: College Project - Meeting Summarizer  
**Diagram Type**: System Workflow & Architecture  
**Audience Level**: Beginner-Friendly  
**Last Updated**: October 2026
