import React, { useState, useCallback } from 'react';
import { sendMessage } from '../api/chat';
import { createMessage, loadHistory, saveHistory, clearHistory } from '../utils/helpers';

export function useChat() {
  const [messages, setMessages] = useState(loadHistory);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const updateMessages = useCallback((updater) => {
    setMessages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveHistory(next);
      return next;
    });
  }, []);

  const send = useCallback(async (text) => {
    const prompt = text.trim();
    if (!prompt || loading) return;

    const userMsg = createMessage('user', prompt);
    updateMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const replyText = await sendMessage(history);
      const aiMsg = createMessage('assistant', replyText);
      updateMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, messages, updateMessages]);

  const clear = useCallback(() => {
    updateMessages([]);
    clearHistory();
    setError(null);
  }, [updateMessages]);

  // Load a past session from sidebar click
  const loadSession = useCallback((sessionMessages) => {
    updateMessages(sessionMessages);
    setError(null);
  }, [updateMessages]);

  return { messages, loading, error, send, clear, loadSession };
}