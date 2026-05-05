import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/helpers';
import { CircleUser, Brain } from 'lucide-react';


function useTypewriter(fullText, active, speed = 16) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active || !fullText) return;
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [fullText, active, speed]);
  return displayed;
}

function AiMessage({ msg, darkMode }) {
  const [streaming, setStreaming] = useState(msg.streaming || false);
  const [copied, setCopied]       = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const displayed = useTypewriter(msg.content, streaming);
  const text = streaming ? displayed : msg.content;

  useEffect(() => {
    if (streaming && displayed === msg.content) setStreaming(false);
  }, [displayed, msg.content, streaming]);

  useEffect(() => { return () => window.speechSynthesis.cancel(); }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const speakText = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const speech = new SpeechSynthesisUtterance(msg.content);
    speech.lang = 'en-US';
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const bubbleBg     = darkMode ? '#141420' : '#ffffff';
  const bubbleBorder = darkMode ? 'rgba(124,106,247,0.2)' : 'rgba(124,106,247,0.25)';
  const textColor    = darkMode ? 'rgba(255,255,255,0.85)' : '#1a1830';
  const metaColor    = darkMode ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.35)';
  const avatarBg     = darkMode ? 'linear-gradient(135deg,#2a1f5e,#1a1a3e)' : 'linear-gradient(135deg,#ede9ff,#d8d0ff)';
  const avatarColor  = darkMode ? '#e8e8f0' : '#5b4fcf';

  return (
    <div style={{
      display: 'flex', gap: 12,
      animation: 'fadeSlideUp 0.35s ease both',
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: avatarBg, border: '1px solid rgba(124,106,247,0.4)',
        fontSize: 13, color: avatarColor, marginTop: 2,
      }}><Brain size={16} /></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: '78%' }}>
        {/* Bubble */}
        <div style={{
          background: bubbleBg, border: `1px solid ${bubbleBorder}`,
          borderRadius: '16px 16px 16px 4px',
          padding: '12px 16px', fontSize: 13, lineHeight: 1.75,
          color: textColor, wordBreak: 'break-word',
          boxShadow: darkMode ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
        }}>
          {text}
          {streaming && (
            <span style={{ opacity: 0.6, marginLeft: 2, animation: 'cursor-blink 0.7s steps(1) infinite' }}>▌</span>
          )}
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: metaColor }}>
          <span>{formatTime(msg.timestamp)}</span>
          {!streaming && (
            <>
              <button onClick={handleCopy} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: copied ? '#4ade80' : metaColor,
                fontSize: 10, padding: '2px 6px', borderRadius: 4,
                fontFamily: "'DM Mono', monospace",
                transition: 'color 0.2s',
              }}>
                {copied ? '✓ copied' : '⎘ copy'}
              </button>
              <button onClick={speakText} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isSpeaking ? '#7c6af7' : metaColor,
                fontSize: 10, padding: '2px 6px', borderRadius: 4,
                fontFamily: "'DM Mono', monospace",
                transition: 'color 0.2s',
              }}>
                {isSpeaking ? '⏹ stop' : '🔊 speak'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg, darkMode }) {
  const bubbleBg     = darkMode ? '#1e1e3a' : '#ede9ff';
  const bubbleBorder = darkMode ? 'rgba(240,98,146,0.25)' : 'rgba(124,106,247,0.3)';
  const textColor    = darkMode ? '#e0d8ff' : '#2a1a5e';
  const metaColor    = darkMode ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.35)';
  const avatarBg     = darkMode ? 'linear-gradient(135deg,#2a1020,#1a1a2e)' : 'linear-gradient(135deg,#ffe0ee,#ffd0e8)';
  const avatarColor  = darkMode ? '#f06292' : '#c2185b';

  return (
    <div style={{
      display: 'flex', flexDirection: 'row-reverse', gap: 12,
      animation: 'fadeSlideUp 0.35s ease both',
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: avatarBg, border: '1px solid rgba(240,98,146,0.4)',
        fontSize: 13, color: avatarColor, marginTop: 2,
      }}><CircleUser size={16} /></div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, maxWidth: '78%' }}>
        {/* Bubble */}
        <div style={{
          background: bubbleBg, border: `1px solid ${bubbleBorder}`,
          borderRadius: '16px 16px 4px 16px',
          padding: '12px 16px', fontSize: 13, lineHeight: 1.75,
          color: textColor, wordBreak: 'break-word',
          boxShadow: darkMode ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
        }}>
          {msg.content}
        </div>

        {/* Timestamp */}
        <div style={{ fontSize: 10, color: metaColor }}>
          {formatTime(msg.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default function Message({ msg, darkMode }) {
  return msg.role === 'user'
    ? <UserMessage msg={msg} darkMode={darkMode} />
    : <AiMessage msg={msg} darkMode={darkMode} />;
}