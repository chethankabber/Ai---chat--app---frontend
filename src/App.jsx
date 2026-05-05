import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import { useChat } from './hooks/useChat';

export default function App() {
  const { messages, loading, error, send, clear, loadSession } = useChat();
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''} style={{ height: '100vh', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: darkMode ? '#0a0a0f' : '#f4f3ff',
        color: darkMode ? '#e8e8f0' : '#1a1830',
        fontFamily: "'DM Mono', monospace",
        position: 'relative',
        overflow: 'hidden',
      }}>

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(p => !p)}
          onNewChat={clear}
          currentMessages={messages}
          onLoadSession={loadSession}
        />

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
            }}
          />
        )}

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          minWidth: 0,
        }}>
          <Header
            messageCount={messages.length}
            onToggleSidebar={() => setSidebarOpen(p => !p)}
            darkMode={darkMode}
            sidebarOpen={sidebarOpen}
          />

          <MessageList
            messages={messages}
            loading={loading}
            error={error}
            onStarter={send}
            darkMode={darkMode}
          />

          <InputArea
            onSend={send}
            disabled={loading}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}