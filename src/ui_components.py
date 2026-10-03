import streamlit as st


def init_session_state():
    """Initialize session state variables when app starts"""
    if "transcript" not in st.session_state:
        st.session_state["transcript"] = ""

    if "meeting_notes" not in st.session_state:
        st.session_state["meeting_notes"] = ""

    if "audio_bytes" not in st.session_state:
        st.session_state["audio_bytes"] = None


def display_transcript():
    """Show the raw transcript in the UI"""
    if st.session_state["transcript"]:
        # Calculate and display word count and character count
        word_count = len(st.session_state["transcript"].split())
        char_count = len(st.session_state["transcript"])

        col1, col2 = st.columns(2)
        col1.metric("Word Count", f"{word_count:,}")
        col2.metric("Character Count", f"{char_count:,}")

        # Display transcript in text box
        st.text_area(
            "Full Transcript",
            st.session_state["transcript"],
            height=300,
        )
    else:
        st.info("📝 Your transcript will appear here after processing.")


def display_meeting_notes():
    """Show the AI-generated meeting notes"""
    if st.session_state["meeting_notes"]:
        st.markdown(st.session_state["meeting_notes"])
    else:
        st.info("📄 Your AI meeting notes will appear here after processing.")


def display_download_buttons():
    """Show download buttons for audio, transcript, and notes"""
    col1, col2, col3 = st.columns(3)

    # Download Audio button
    with col1:
        if st.session_state["audio_bytes"]:
            st.download_button(
                label="💾 Download Audio (.wav)",
                data=st.session_state["audio_bytes"],
                file_name="meeting_audio.wav",
                mime="audio/wav",
            )
        else:
            st.button("💾 Download Audio (.wav)", disabled=True)

    # Download Transcript button
    with col2:
        if st.session_state["transcript"]:
            st.download_button(
                label="📝 Download Transcript (.txt)",
                data=st.session_state["transcript"],
                file_name="transcript.txt",
                mime="text/plain",
            )
        else:
            st.button("📝 Download Transcript (.txt)", disabled=True)

    # Download Meeting Notes button
    with col3:
        if st.session_state["meeting_notes"]:
            st.download_button(
                label="📄 Download Notes (.md)",
                data=st.session_state["meeting_notes"],
                file_name="meeting_notes.md",
                mime="text/markdown",
            )
        else:
            st.button("📄 Download Notes (.md)", disabled=True)
