'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './ChatWidget.module.css';
import { GREETING } from '@/lib/chatKnowledge';

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || "Something went wrong — please call (908) 777-0631." }]);
        setError(true);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection issue — please call (908) 777-0631 or use the contact form." }]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // The chat bot is trained on lib/chatKnowledge.js — consumer pricing,
  // portrait/sports FAQ, mini-session promos. A federal buyer opening it
  // on the Government Practice page would get answers built for a
  // completely different audience, which is worse for credibility than
  // no chat bubble at all. Hidden on this route until (if ever) a
  // government-specific knowledge base is built. Hook order preserved —
  // this check runs after all hooks above.
  if (pathname?.startsWith('/government-contracting')) return null;

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Chat with Zarcone Photography">
          <div className={styles.header}>
            <div>
              <p className={styles.headerTitle}>Zarcone Photography</p>
              <p className={styles.headerSub}>Usually replies within 24 hours</p>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form className={styles.inputRow} onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about sessions, pricing, booking…"
              className={styles.input}
              maxLength={2000}
              disabled={loading}
            />
            <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
          {error && (
            <p className={styles.fallback}>
              Prefer to talk directly? <a href="tel:9087770631">(908) 777-0631</a>
            </p>
          )}
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '×' : 'Chat'}
      </button>
    </div>
  );
}
