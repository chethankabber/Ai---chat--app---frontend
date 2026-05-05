// ── Format timestamp to HH:MM ───────────────────────────────
export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Generate a unique ID for each message ───────────────────
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Build a message object ───────────────────────────────────
export function createMessage(role, content) {
  return {
    id: generateId(),
    role,        // 'user' | 'assistant'
    content,
    timestamp: Date.now(),
    streaming: role === 'assistant', // triggers typewriter effect
  };
}

// ── LocalStorage helpers ─────────────────────────────────────
const STORAGE_KEY = 'neural_chat_history';

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch { /* storage full or unavailable — fail silently */ }
}

export function clearHistory() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
