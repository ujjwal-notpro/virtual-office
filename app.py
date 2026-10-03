import streamlit as st
from streamlit_mic_recorder import mic_recorder

from src.config import Config
from src.transcriber import transcribe_audio
from src.summarizer import summarize_text
from src.ui_components import (
    init_session_state,
    display_transcript,
    display_meeting_notes,
    display_download_buttons
)

# page config
st.set_page_config(
    page_title="AI Meeting Notes Generator",
    page_icon=Config.APP_ICON,
    layout="wide"
)

st.title(Config.APP_TITLE)
st.caption("Record live audio or upload an MP3 file to transcribe and summarize using AI.")

# init state
init_session_state()

# layout
col1, col2 = st.columns(2)

# left side: input
with col1:
    st.header("1. Input Audio")

    # choose recording or upload
    option = st.radio(
        "Choose option:",
        ["Live Recording", "Upload MP3"],
        horizontal=True
    )

    if option == "Live Recording":
        st.write("Click to record:")
        audio_data = mic_recorder(
            start_prompt="Start Recording",
            stop_prompt="Stop Recording",
            key="recorder"
        )

        if audio_data:
            st.session_state["audio_bytes"] = audio_data["bytes"]
            st.success("Audio recorded!")
            st.audio(st.session_state["audio_bytes"], format="audio/wav")

    else:
        uploaded_file = st.file_uploader("Upload an MP3 file", type=["mp3"])
        if uploaded_file is not None:
            st.session_state["audio_bytes"] = uploaded_file.read()
            st.success(f"File uploaded: {uploaded_file.name}")
            st.audio(st.session_state["audio_bytes"], format="audio/mp3")

    st.markdown("---")

    # submit button
    if st.button("Generate Summary", type="primary", disabled=st.session_state["audio_bytes"] is None):
        with st.spinner("Transcribing audio with Whisper..."):
            try:
                # 1. transcribe
                st.session_state["transcript"] = transcribe_audio(st.session_state["audio_bytes"])

                # 2. summarize
                with st.spinner("Summarizing with BART..."):
                    st.session_state["meeting_notes"] = summarize_text(st.session_state["transcript"])
                st.success("Done!")

            except Exception as e:
                st.error(f"Error: {e}")

# right side: output
with col2:
    st.header("2. Results")
    tab1, tab2 = st.tabs(["Meeting Notes", "Raw Transcript"])

    with tab1:
        display_meeting_notes()

    with tab2:
        display_transcript()

# download section
st.markdown("---")
st.header("3. Download")
display_download_buttons()
