import React, { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';

const MAX_CHARS = 4000;

export default function InputArea({ onSend, disabled, darkMode }) {
  const [text, setText]           = useState('');
  const [recording, setRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const textareaRef   = useRef(null);
  const recognitionRef = useRef(null);
  const analyserRef   = useRef(null);
  const animFrameRef  = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [text]);

  useEffect(() => {
    return () => {
      stopRecording();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(avg);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (e) => {
          const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
          setText(transcript);
        };
        recognition.onerror = () => stopRecording();
        recognition.start();
        recognitionRef.current = recognition;
      }
      setRecording(true);
    } catch {
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    cancelAnimationFrame(animFrameRef.current);
    setRecording(false);
    setAudioLevel(0);
  };

  const pulseScale = recording ? 1 + (audioLevel / 255) * 0.5 : 1;

  // Theme values
  const wrapBg      = darkMode ? 'rgba(10,10,15,0.95)'  : 'rgba(244,243,255,0.95)';
  const wrapBorder  = darkMode ? '#2a2a3a' : '#ddd8ff';
  const boxBg       = darkMode ? '#1a1a24' : '#ffffff';
  const boxBorder   = recording
    ? 'rgba(239,68,68,0.6)'
    : darkMode ? '#2a2a3a' : '#d0caff';
  const boxShadow   = recording
    ? '0 0 0 3px rgba(239,68,68,0.1)'
    : 'none';
  const textColor   = darkMode ? 'rgba(255,255,255,0.85)' : '#1a1830';
  const placeholder = darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
  const micIdleBg   = darkMode ? '#2a2a3a' : '#ebe8ff';
  const micIdleColor = darkMode ? 'rgba(255,255,255,0.5)' : '#7c6af7';
  const micIdleBorder = darkMode ? '#3a3a4a' : '#c8c0ff';
  const footerColor = darkMode ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.3)';

  return (
    <div style={{
      padding: '12px 16px 18px',
      borderTop: `1px solid ${wrapBorder}`,
      background: wrapBg,
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
    }}>

      {/* Recording bar */}
      {recording && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 8, padding: '0 4px',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#ef4444', display: 'block',
            animation: 'dotPulse 1s infinite',
          }} />
          <span style={{ fontSize: 11, color: '#f87171', letterSpacing: '0.08em' }}>
            RECORDING — speak now
          </span>
          <div style={{
            flex: 1, height: 4, borderRadius: 4,
            background: darkMode ? '#1a1a24' : '#e0dcff', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #7c6af7, #f06292)',
              width: `${(audioLevel / 255) * 100}%`,
              transition: 'width 0.07s',
            }} />
          </div>
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 8,
        background: boxBg, borderRadius: 18,
        padding: '10px 10px 10px 16px',
        border: `1px solid ${boxBorder}`,
        boxShadow: boxShadow,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={recording ? 'Listening... speak now' : 'Write a message...'}
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            resize: 'none', minHeight: 22, maxHeight: 120,
            fontSize: 13, lineHeight: 1.6,
            color: textColor,
            fontFamily: "'DM Mono', monospace",
            overflowY: 'auto',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />

        {/* Mic button */}
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={disabled}
          title={recording ? 'Stop recording' : 'Voice input'}
          style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer',
            transform: `scale(${pulseScale})`,
            transition: 'all 0.15s',
            background: recording ? '#ef4444' : micIdleBg,
            color: recording ? '#fff' : micIdleColor,
            border: recording ? 'none' : `1px solid ${micIdleBorder}`,
            boxShadow: recording ? '0 0 16px rgba(239,68,68,0.5)' : 'none',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          {recording ? '■' : <Mic size={16} />}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          title="Send"
          style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 'bold',
            background: 'linear-gradient(135deg, #7c6af7, #5b4fcf)',
            color: '#fff', border: 'none',
            cursor: !text.trim() || disabled ? 'not-allowed' : 'pointer',
            opacity: !text.trim() || disabled ? 0.4 : 1,
            transition: 'all 0.2s',
          }}
        >
          ↑
        </button>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 8, padding: '0 4px',
        fontSize: 10, color: footerColor, letterSpacing: '0.04em',
      }}>
        <span>⇧↵ new line · ↵ send · 🎙 voice</span>
        <span style={{ color: text.length > 3800 ? '#f87171' : footerColor }}>
          {text.length}/{MAX_CHARS}
        </span>
      </div> 
    </div>
  );
}