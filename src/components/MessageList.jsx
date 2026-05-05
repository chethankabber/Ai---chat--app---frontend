import React, { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const STARTERS = [
  "Explain quantum computing simply",
  "Write a React custom hook",
  "Best practices for REST APIs",
  "Debug: undefined is not a function",
];

export default function MessageList({ messages, loading, error, onStarter, darkMode }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const dimText = darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)';
  const chipBg  = darkMode ? '#1a1a24' : '#ebe8ff';
  const chipBorder = darkMode ? '#2a2a3a' : '#d0caff';
  const chipText   = darkMode ? 'rgba(255,255,255,0.35)' : '#6060a0';

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      scrollbarWidth: 'thin',
      scrollbarColor: `${darkMode ? '#2a2a3a' : '#ccc'} transparent`,
    }}>

      {/* Empty state */}
      {messages.length === 0 && !loading && (
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '60px 20px', gap: 16,
        }}>
          <span style={{ fontSize: 44 }}>◈</span>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: 22,
            background: 'linear-gradient(135deg, #7c6af7, #f06292)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>
            Start a conversation
          </h2>

          <p style={{ fontSize: 12, color: dimText, lineHeight: 1.8, maxWidth: 280, margin: 0 }}>
            Ask anything. Your chat history is saved locally between sessions.
          </p>

          {/* Starter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            {STARTERS.map(s => (
              <button
                key={s}
                onClick={() => onStarter(s)}
                style={{
                  fontSize: 11, padding: '7px 16px', borderRadius: 20,
                  background: chipBg, border: `1px solid ${chipBorder}`,
                  color: chipText, cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#7c6af7';
                  e.currentTarget.style.color = '#7c6af7';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = chipBorder;
                  e.currentTarget.style.color = chipText;
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map(msg => (
        <Message key={msg.id} msg={msg} darkMode={darkMode} />
      ))}

      {/* Typing indicator */}
      {loading && <TypingIndicator darkMode={darkMode} />}

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.3)',
          color: '#f87171', fontSize: 12,
        }}>
          <span>⚠</span><span>{error}</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}