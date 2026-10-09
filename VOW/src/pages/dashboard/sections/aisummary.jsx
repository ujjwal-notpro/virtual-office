import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Mic, Upload, FileText, Download, Check, RefreshCw, Square, Play, Pause, AlertCircle } from 'lucide-react';

const AISummary = () => {
  const [inputType, setInputType] = useState('live'); // 'live' | 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');

  const [toastMessage, setToastMessage] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
      } else {
        console.log("MediaRecorder unavailable, using fallback timer");
      }

      setIsRecording(true);
      setRecordingTime(0);
      setRecordedAudioUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.warn("Microphone access permission error or unavailable, running recording mode:", err);
      setIsRecording(true);
      setRecordingTime(0);
      setRecordedAudioUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setRecordedAudioUrl('simulated_recording.wav');
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const canGenerate = (inputType === 'live' && (recordedAudioUrl || recordingTime > 0)) || (inputType === 'upload' && uploadedFile);

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      showToast('AI Notes & Transcript generated successfully!');
    }, 1400);
  };

  const sampleNotes = {
    summary: "The team discussed the Q3 product launch timeline, key architectural decisions for the real-time sync module, and upcoming client deliverables.",
    keyTakeaways: [
      "Finalized API contract for the video/audio streaming service.",
      "Frontend team will integrate live transcription UI by Friday.",
      "Security audit scheduled for next Tuesday before staging deployment."
    ],
    actionItems: [
      "Alex: Submit API documentation to the dev portal.",
      "Sarah: Prepare load testing scripts for 10k concurrent users.",
      "Jordan: Schedule alignment call with stakeholders."
    ]
  };

  const sampleTranscript = `[00:01] Host: Welcome everyone to today's sync meeting. Let's cover our main objectives for the AI Meeting Notes feature.
[00:12] Developer 1: The backend socket pipelines are operational. Audio chunking is running at sub-50ms latency.
[00:24] Developer 2: Perfect. On the frontend, we have finalized the UI component with options for live microphone input and file upload.
[00:45] Product Manager: Excellent progress. Once generated, users can save audio, raw transcript, and markdown meeting notes.
[01:05] Host: Great work team. Let's wrap up and push this live to production.`;

  const handleDownload = (type) => {
    if (!hasGenerated && type !== 'audio') {
      showToast('Please generate summary first to download notes or transcript.');
      return;
    }

    let filename = '';
    let content = '';
    let mimeType = 'text/plain';

    if (type === 'audio') {
      filename = 'meeting_audio.wav';
      content = 'Simulated Audio Data';
      mimeType = 'audio/wav';
    } else if (type === 'transcript') {
      filename = 'meeting_transcript.txt';
      content = sampleTranscript;
    } else if (type === 'notes') {
      filename = 'meeting_notes.md';
      content = `# AI Meeting Notes\n\n## Executive Summary\n${sampleNotes.summary}\n\n## Key Takeaways\n${sampleNotes.keyTakeaways.map(k => `- ${k}`).join('\n')}\n\n## Action Items\n${sampleNotes.actionItems.map(a => `- ${a}`).join('\n')}`;
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${filename}`);
  };

  return (
    <div className="min-h-full w-full bg-[#0a0c10] text-[#e2e8f0] p-6 md:p-10 font-sans select-none relative">

      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-emerald-500/40 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="text-2xl md:text-3xl">🎙️</span>
            AI Meeting Notes Generator
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 font-normal">
            Record live audio or upload an MP3 file to transcribe and summarize using AI.
          </p>
        </div>

        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <button
            onClick={() => showToast('App ready for deployment!')}
            className="hover:text-white transition-colors text-xs md:text-sm font-medium cursor-pointer"
          >
            Deploy
          </button>
          <button
            className="p-1 hover:text-white hover:bg-zinc-800/60 rounded transition-colors cursor-pointer"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-12">

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">1. Input Audio</h2>

            <p className="text-xs md:text-sm text-zinc-300 font-medium mb-3">Choose option:</p>
            <div className="flex items-center gap-6 mb-7">
              <label
                onClick={() => setInputType('live')}
                className="flex items-center gap-2.5 text-xs md:text-sm text-zinc-200 cursor-pointer select-none"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full border transition-all ${inputType === 'live' ? 'border-red-500 bg-red-500/10' : 'border-zinc-600 bg-transparent'}`} />
                  {inputType === 'live' && (
                    <div className="w-2 h-2 rounded-full bg-red-500 absolute" />
                  )}
                </div>
                <span>Live Recording</span>
              </label>

              <label
                onClick={() => setInputType('upload')}
                className="flex items-center gap-2.5 text-xs md:text-sm text-zinc-200 cursor-pointer select-none"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full border transition-all ${inputType === 'upload' ? 'border-red-500 bg-red-500/10' : 'border-zinc-600 bg-transparent'}`} />
                  {inputType === 'upload' && (
                    <div className="w-2 h-2 rounded-full bg-red-500 absolute" />
                  )}
                </div>
                <span>Upload MP3</span>
              </label>
            </div>
            {inputType === 'live' ? (
              <div className="space-y-3">
                <p className="text-xs md:text-sm text-zinc-400">Click to record:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleRecording}
                    className={`px-4 py-2 rounded-md border text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${isRecording
                      ? 'bg-red-950/40 border-red-500/80 text-red-400 hover:bg-red-900/50 shadow-sm'
                      : 'bg-[#181b22] border-zinc-700/80 text-white hover:bg-[#20242e] hover:border-zinc-500'
                      }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                        Stop Recording ({formatTime(recordingTime)})
                      </>
                    ) : (
                      <>Start Recording</>
                    )}
                  </button>

                  {recordedAudioUrl && !isRecording && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                      <Check className="w-3.5 h-3.5" /> Audio Ready ({formatTime(recordingTime)})
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs md:text-sm text-zinc-400">Select MP3 file:</p>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-md bg-[#181b22] border border-zinc-700/80 text-xs md:text-sm text-zinc-200 hover:text-white hover:border-zinc-500 transition-all cursor-pointer font-medium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-zinc-400" />
                  {uploadedFile ? uploadedFile.name : 'Choose Audio File (.mp3, .wav)'}
                </button>
              </div>
            )}
          </div>
          <div className="pt-8 border-t border-zinc-800/80 mt-8 mb-2">
            <button
              onClick={handleGenerateSummary}
              disabled={!canGenerate || isGenerating}
              className={`px-4 py-2 rounded-md border text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${canGenerate && !isGenerating
                ? 'bg-[#181b22] border-zinc-700/80 text-white hover:bg-[#222632] hover:border-zinc-500 cursor-pointer shadow-sm'
                : 'bg-[#13151b] border-zinc-800/70 text-zinc-600 cursor-not-allowed'
                }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                  Generating Summary...
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight">2. Results</h2>

          <div className="flex items-center gap-6 border-b border-zinc-800/90 mb-5 pb-0">
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 text-xs md:text-sm font-medium transition-all relative cursor-pointer ${activeTab === 'notes'
                ? 'text-red-500 font-semibold border-b-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              Meeting Notes
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-2 text-xs md:text-sm font-medium transition-all relative cursor-pointer ${activeTab === 'transcript'
                ? 'text-red-500 font-semibold border-b-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              Raw Transcript
            </button>
          </div>

          <div className="bg-[#0b172a] border border-[#1a2b47] rounded-lg p-5 min-h-[160px] flex flex-col justify-center transition-all duration-300">
            {!hasGenerated ? (
              <p className="text-[#3b82f6] text-xs md:text-sm font-normal leading-relaxed">
                Your AI meeting notes will appear here after processing
              </p>
            ) : (
              <div className="text-zinc-200 text-xs md:text-sm space-y-4 animate-fadeIn">
                {activeTab === 'notes' ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">Executive Summary</h4>
                      <p className="text-zinc-300 leading-relaxed">{sampleNotes.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Key Takeaways</h4>
                      <ul className="list-disc list-inside space-y-1 text-zinc-300">
                        {sampleNotes.keyTakeaways.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">Action Items</h4>
                      <ul className="list-disc list-inside space-y-1 text-zinc-300">
                        {sampleNotes.actionItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {sampleTranscript}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800/70">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">3. Download</h2>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => handleDownload('audio')}
            className="px-4 py-2 rounded-md bg-[#181b22] border border-zinc-700/80 text-xs md:text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-all cursor-pointer font-medium shadow-xs"
          >
            Save Audio (.wav)
          </button>

          <button
            onClick={() => handleDownload('transcript')}
            className="px-4 py-2 rounded-md bg-[#181b22] border border-zinc-700/80 text-xs md:text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-all cursor-pointer font-medium shadow-xs"
          >
            Save Transcript (.txt)
          </button>

          <button
            onClick={() => handleDownload('notes')}
            className="px-4 py-2 rounded-md bg-[#181b22] border border-zinc-700/80 text-xs md:text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-all cursor-pointer font-medium shadow-xs"
          >
            Save Notes (.md)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISummary;
