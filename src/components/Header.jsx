import React from 'react';

export default function Header({ messageCount, onToggleSidebar, darkMode, sidebarOpen }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: `1px solid ${darkMode ? '#2a2a3a' : '#ddd8ff'}`,
      background: darkMode ? 'rgba(10,10,15,0.95)' : 'rgba(244,243,255,0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Left: sidebar toggle + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          style={{
            background: 'none',
            border: `1px solid ${darkMode ? '#2a2a3a' : '#ddd8ff'}`,
            borderRadius: 8,
            width: 34, height: 34,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            color: darkMode ? '#7070a0' : '#7070a0',
            transition: 'all 0.2s',
          }}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <div>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.08em',
            color: darkMode ? '#e8e8f0' : '#1a1830',
            margin: 0,
          }}>
            GT-CHAT
          </p>
          {/* <p style={{
            fontSize: 10,
            color: darkMode ? '#7070a0' : '#9090c0',
            letterSpacing: '0.06em',
            margin: 0,
          }}>
            {messageCount} message{messageCount !== 1 ? 's' : ''}
          </p> */}
        </div>
      </div>

      {/* Right: glowing dot status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#7c6af7',
          display: 'block',
          boxShadow: '0 0 8px rgba(124,106,247,0.8)',
        }} />
        <span style={{
          fontSize: 10,
          color: darkMode ? '#7070a0' : '#9090c0',
          letterSpacing: '0.06em',
        }}>
          online
        </span>
      </div>
    </header>
  );
}