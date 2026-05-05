import React, { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
import { ChevronsLeft } from 'lucide-react';

const HISTORY_KEY = 'neural_chat_sessions';

// Save a completed session to history
export function saveSession(messages) {
  if (!messages || messages.length < 2) return;
  try {
    const sessions = loadSessions();
    const firstUserMsg = messages.find(m => m.role === 'user');
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '')
      : 'New Chat';

    const session = {
      id: Date.now(),
      title,
      messages,
      timestamp: Date.now(),
    };

    // Avoid duplicate saves — replace if same first message
    const filtered = sessions.filter(s => s.title !== title);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([session, ...filtered].slice(0, 50)));
  } catch {}
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function formatDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Sidebar({
  open, onClose, darkMode, onToggleDark,
  onNewChat, currentMessages, onLoadSession
}) {
  const [sessions, setSessions]       = useState(loadSessions);
  const [expandedDate, setExpandedDate] = useState(null);

  // Reload sessions whenever sidebar opens
  useEffect(() => {
    if (open) setSessions(loadSessions());
  }, [open]);

  // Auto-save current chat when it has messages
  useEffect(() => {
    if (currentMessages?.length >= 2) {
      saveSession(currentMessages);
      setSessions(loadSessions());
    }
  }, [currentMessages]);

  // Group sessions by date label
  const grouped = sessions.reduce((acc, s) => {
    const label = formatDate(s.timestamp);
    if (!acc[label]) acc[label] = [];
    acc[label].push(s);
    return acc;
  }, {});

  const bg      = darkMode ? '#111118' : '#ffffff';
  const border  = darkMode ? '#2a2a3a' : '#e0dcff';
  const text    = darkMode ? '#e8e8f0' : '#1a1830';
  const dimText = darkMode ? '#7070a0' : '#9090c0';
  const hover   = darkMode ? '#1a1a28' : '#f0eeff';
  const accent  = '#7c6af7';

  return (
    <>
      {/* Sidebar panel */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        height: '100vh',
        width: open ? 280 : 0,
        minWidth: open ? 280 : 0,
        background: bg,
        borderRight: open ? `1px solid ${border}` : 'none',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: open ? '4px 0 24px rgba(0,0,0,0.3)' : 'none',
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 16px 14px',
          borderBottom: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: 13,
            letterSpacing: '0.1em',
            color: text,
          }}>GT-CHAT</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: dimText, cursor: 'pointer', fontSize: 16,
            padding: '2px 6px', borderRadius: 6,
          }}><ChevronsLeft size={22} /></button>
        </div>

        {/* New Chat button */}
        <div style={{ padding: '12px 12px 8px', flexShrink: 0 }}>
          <button
            onClick={() => { onNewChat(); onClose(); }}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: `linear-gradient(135deg, ${accent}, #5b4fcf)`,
              border: 'none', borderRadius: 10,
              color: '#fff', cursor: 'pointer',
              fontSize: 13, fontFamily: "'DM Mono', monospace",
              display: 'flex', alignItems: 'center', gap: 8,
              fontWeight: 500, letterSpacing: '0.04em',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: 16 }}>＋</span> New Chat
          </button>
        </div>

        {/* Dark / Light toggle */}
        <div style={{
          margin: '0 12px 8px',
          padding: '10px 14px',
          background: darkMode ? '#1a1a28' : '#f0eeff',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: dimText }}>
            {darkMode ? '☾ Dark mode' : '☀ Light mode'}
          </span>
          {/* Toggle switch */}
          <div
            onClick={onToggleDark}
            style={{
              width: 36, height: 20,
              borderRadius: 10,
              background: darkMode ? accent : '#ccc',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.25s',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute',
              top: 2,
              left: darkMode ? 18 : 2,
              width: 16, height: 16,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.25s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${border}`, margin: '4px 12px', flexShrink: 0 }} />

        {/* Recent chats label */}
        <div style={{
          padding: '8px 16px 4px',
          fontSize: 10, color: dimText,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          Recent Chats
        </div>

        {/* Sessions list */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '4px 8px 16px',
        }}>
          {Object.keys(grouped).length === 0 && (
            <div style={{
              textAlign: 'center', color: dimText,
              fontSize: 12, marginTop: 32, lineHeight: 1.8,
            }}>
              No chats yet.<br />Start a conversation!
            </div>
          )}

          {Object.entries(grouped).map(([dateLabel, chats]) => (
            <div key={dateLabel}>
              {/* Date group header — click to expand/collapse */}
              <button
                onClick={() => setExpandedDate(expandedDate === dateLabel ? null : dateLabel)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 8px', borderRadius: 7,
                  cursor: 'pointer', color: dimText,
                  fontSize: 11, letterSpacing: '0.06em',
                  marginTop: 4,
                }}
              >
                <span>{dateLabel}</span>
                <span style={{
                  transform: expandedDate === dateLabel ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s', fontSize: 10,
                }}>▶</span>
              </button>

              {/* Chat items under this date */}
              {expandedDate === dateLabel && chats.map(session => (
                <button
                  key={session.id}
                  onClick={() => {
                    if (onLoadSession) onLoadSession(session.messages);
                    onClose();
                  }}
                  style={{
                    width: '100%', background: 'none',
                    border: `1px solid transparent`,
                    borderRadius: 8, padding: '8px 12px',
                    cursor: 'pointer', textAlign: 'left',
                    color: text, fontSize: 12,
                    fontFamily: "'DM Mono', monospace",
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s',
                    marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = hover;
                    e.currentTarget.style.borderColor = border;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 12, flexShrink: 0 }}><MessageSquareText size={16} /></span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.title}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}