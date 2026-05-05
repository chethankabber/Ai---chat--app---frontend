import React from 'react';

export default function TypingIndicator({ darkMode }) {
  const bubbleBg     = darkMode ? '#141420' : '#ffffff';
  const bubbleBorder = darkMode ? 'rgba(124,106,247,0.2)' : 'rgba(124,106,247,0.25)';
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
      }}>✦</div>

      {/* Dots */}
      <div style={{
        background: bubbleBg, border: `1px solid ${bubbleBorder}`,
        borderRadius: '16px 16px 16px 4px',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: darkMode ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
      }}>
        {[
          { color: '#7c6af7', delay: '0s' },
          { color: '#a67cf7', delay: '0.2s' },
          { color: '#f06292', delay: '0.4s' },
        ].map((dot, i) => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: dot.color, display: 'block',
            animation: `dotPulse 1.4s ${dot.delay} infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}