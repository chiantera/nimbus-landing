import { useEffect, useRef, useState } from 'react'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Msg = {
  role: 'assistant',
  content: "Hey! I'm the Nimbus assistant 👋 Ask me anything about features, pricing, or getting started.",
}

const SUGGESTIONS = ['What can Nimbus do?', 'How much is Pro?', 'Is my data secure?']

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string }
      const reply = res.ok
        ? data.reply ?? '(no response)'
        : data.error ?? `Something went wrong (${res.status}).`
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'I could not reach the server. Is the AI backend running?' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Nimbus assistant">
          <div className="chat-head">
            <span className="chat-avatar">◎</span>
            <div className="chat-head-text">
              <strong>Nimbus Assistant</strong>
              <span>Powered by your LLM</span>
            </div>
            <button className="chat-close" aria-label="Close chat" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bubble bubble-${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bubble bubble-assistant typing">
                <span />
                <span />
                <span />
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Nimbus…"
              aria-label="Message"
            />
            <button type="submit" aria-label="Send" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        className={`chat-bubble${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close chat' : 'Chat with us'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  )
}
