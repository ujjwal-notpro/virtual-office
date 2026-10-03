import streamlit as st


def init_session_state():
    # initialize variables if not present
    if "transcript" not in st.session_state:
        st.session_state["transcript"] = ""

    if "meeting_notes" not in st.session_state:
        st.session_state["meeting_notes"] = ""

    if "audio_bytes" not in st.session_state:
        st.session_state["audio_bytes"] = None


def display_transcript():
    # show transcript
    if st.session_state["transcript"]:
        text = st.session_state["transcript"]
        words = len(text.split())
        chars = len(text)

        col1, col2 = st.columns(2)
        col1.metric("Word Count", f"{words}")
        col2.metric("Character Count", f"{chars}")

        st.text_area(
            "Full Transcript",
            text,
            height=300
        )
    else:
        st.info("Your transcript will appear here after processing")


def display_meeting_notes():
    # show notes
    if st.session_state["meeting_notes"]:
        st.markdown(st.session_state["meeting_notes"])
    else:
        st.info("Your AI meeting notes will appear here after processing")


def display_download_buttons():
    # 3 columns for downloads
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.session_state["audio_bytes"]:
            st.download_button(
                label="Save Audio (.wav)",
                data=st.session_state["audio_bytes"],
                file_name="meeting.wav",
                mime="audio/wav"
            )
        else:
            st.button("Save Audio (.wav)", disabled=True)

    with col2:
        if st.session_state["transcript"]:
            st.download_button(
                label="Save Transcript (.txt)",
                data=st.session_state["transcript"],
                file_name="transcript.txt",
                mime="text/plain"
            )
        else:
            st.button("Save Transcript (.txt)", disabled=True)

    with col3:
        if st.session_state["meeting_notes"]:
            st.download_button(
                label="Save Notes (.md)",
                data=st.session_state["meeting_notes"],
                file_name="meeting_notes.md",
                mime="text/markdown"
            )
        else:
            st.button("Save Notes (.md)", disabled=True)
