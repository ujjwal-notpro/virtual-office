import streamlit as st
from streamlit_mic_recorder import mic_recorder

from src.config import Config
from src.transcriber import transcribe_audio
from src.summarizer import summarize_text
from src.ui_components import (
    init_session_state,
    display_transcript,
    display_meeting_notes,
    display_download_buttons,
)


# ---- Page Setup ----
st.set_page_config(
    page_title="AI Meeting Notes Generator",
    page_icon=Config.APP_ICON,
    layout="wide",
)

st.title(Config.APP_TITLE)
st.caption(
    "🎙️ Record live audio or upload an MP3 meeting recording to generate instant transcriptions and AI summaries."
)

# ---- Initialize Session State ----
init_session_state()

# ---- 2-Column Layout ----
col1, col2 = st.columns([1, 1], gap="large")

# Left Column: Audio Input
with col1:
    st.header("1. Input Audio")

    # Radio button to choose input method
    input_method = st.radio(
        "Choose Audio Source:",
        ["🎤 Live Microphone", "📁 Upload MP3 File"],
        horizontal=True,
    )

    if input_method == "🎤 Live Microphone":
        st.write("Click below to record:")
        audio_data = mic_recorder(
            start_prompt="Start Recording",
            stop_prompt="Stop and Save",
            key="recorder",
        )

        if audio_data:
            st.session_state["audio_bytes"] = audio_data["bytes"]
            st.success("✅ Audio recorded successfully!")
            st.audio(st.session_state["audio_bytes"], format="audio/wav")

    else:
        uploaded_file = st.file_uploader(
            "Upload meeting recording (.mp3)",
            type=["mp3"],
        )
        if uploaded_file is not None:
            st.session_state["audio_bytes"] = uploaded_file.read()
            st.success(f"✅ Loaded: {uploaded_file.name}")
            st.audio(st.session_state["audio_bytes"], format="audio/mp3")

    st.markdown("---")

    # Process Button
    process_btn = st.button(
        "✨ Generate AI Transcript & Notes",
        type="primary",
        disabled=st.session_state["audio_bytes"] is None,
        use_container_width=True,
    )

    if process_btn:
        with st.spinner("⏳ Transcribing audio with Whisper AI..."):
            try:
                # Step 1: Convert Audio to Text
                st.session_state["transcript"] = transcribe_audio(
                    st.session_state["audio_bytes"]
                )

                # Step 2: Generate Summary from Text
                with st.spinner("🧠 Generating meeting summary with BART AI..."):
                    st.session_state["meeting_notes"] = summarize_text(
                        st.session_state["transcript"]
                    )
                st.success("🎉 Processed successfully!")

            except Exception as error:
                st.error(f"❌ Error: {error}")

# Right Column: Output Tabs
with col2:
    st.header("2. AI Output")
    tab1, tab2 = st.tabs(["📄 Meeting Notes", "📝 Full Transcript"])

    with tab1:
        display_meeting_notes()

    with tab2:
        display_transcript()

# ---- Bottom Section: Download Options ----
st.markdown("---")
st.header("3. Download Results")
display_download_buttons()
