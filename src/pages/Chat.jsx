// src/pages/Chat.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";

const MODE_CONFIG = {
  friend:    { icon: "☺", label: "Friend",    color: "text-sage-400",  bg: "bg-sage-400/10  border-sage-400/20"  },
  guide:     { icon: "◈", label: "Guide",     color: "text-sky-400",   bg: "bg-sky-400/10   border-sky-400/20"   },
  therapist: { icon: "◎", label: "Therapist", color: "text-clay-400",  bg: "bg-clay-400/10  border-clay-400/20"  },
  auto:      { icon: "✦", label: "Auto",      color: "text-ink-400",   bg: "bg-ink-700/50   border-ink-600/30"   },
  error:     { icon: "!", label: "Error",     color: "text-clay-400",  bg: "bg-clay-400/10  border-clay-400/20"  },
};

function PatternBar({ label, value, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-ink-500">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-sage-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Message({ msg, onFeedback }) {
  const isUser = msg.role === "user";
  const cfg = MODE_CONFIG[msg.mode] || MODE_CONFIG.auto;
  const [rated, setRated] = useState(null);

  const handleRate = (r) => {
    setRated(r);
    if (onFeedback && msg.messageId) onFeedback(msg.messageId, r);
  };

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5
        ${isUser ? "bg-ink-700 text-ink-300" : "bg-ink-800 border border-ink-700 text-sage-400"}`}>
        {isUser ? "M" : "◈"}
      </div>

      <div className={`max-w-[78%] space-y-1.5 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-ink-700 text-ink-100 rounded-tr-sm"
            : "bg-ink-800 border border-ink-700/60 text-ink-200 rounded-tl-sm"
          }`}>
          {msg.content}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 px-1">
          {!isUser && msg.mode && msg.mode !== "error" && (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
          )}

          {/* Feedback */}
          {!isUser && msg.messageId && (
            <div className="flex gap-1">
              <button
                onClick={() => handleRate(1)}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors
                  ${rated === 1 ? "text-sage-400" : "text-ink-600 hover:text-ink-400"}`}
              >
                ↑
              </button>
              <button
                onClick={() => handleRate(-1)}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors
                  ${rated === -1 ? "text-clay-400" : "text-ink-600 hover:text-ink-400"}`}
              >
                ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-7 h-7 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center text-xs text-sage-400 flex-shrink-0">
        ◈
      </div>
      <div className="bg-ink-800 border border-ink-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-ink-500 animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, logout } = useAuth();
  const { messages, loading, patterns, modeUsed, sendMessage, sendFeedback, clearChat } = useChat(user.uid);
  const [input, setInput]   = useState("");
  const [mode, setMode]     = useState("auto");
  const messagesEndRef       = useRef(null);
  const textareaRef          = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    textareaRef.current.style.height = "auto";
    sendMessage(text, mode);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const patternMax = Math.max(...Object.values(patterns).filter((v, i) => i < 5), 1);
  const currentMode = MODE_CONFIG[modeUsed] || MODE_CONFIG.auto;

  return (
    <div className="min-h-screen bg-ink-950 flex">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-ink-900 border-r border-ink-800 flex flex-col py-5 px-4 flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center text-sage-400 text-sm">
            ◈
          </div>
          <div>
            <div className="font-display text-ink-100 text-base leading-none">Mitra</div>
            <div className="text-ink-500 text-xs mt-0.5">companion</div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="mb-6">
          <p className="text-ink-600 text-xs uppercase tracking-widest mb-2.5">Mode</p>
          <div className="space-y-1">
            {["auto", "friend", "guide", "therapist"].map((m) => {
              const cfg = MODE_CONFIG[m];
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all
                    ${mode === m
                      ? "bg-ink-800 border border-ink-700 text-ink-100"
                      : "text-ink-500 hover:text-ink-300 hover:bg-ink-800/50"
                    }`}
                >
                  <span className={cfg.color}>{cfg.icon}</span>
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current detected mode */}
        <div className="mb-6">
          <p className="text-ink-600 text-xs uppercase tracking-widest mb-2.5">Detected</p>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${currentMode.bg} ${currentMode.color}`}>
            <span>{currentMode.icon}</span>
            <span>{currentMode.label}</span>
          </div>
        </div>

        {/* Patterns */}
        {Object.keys(patterns).length > 0 && (
          <div className="mb-6">
            <p className="text-ink-600 text-xs uppercase tracking-widest mb-3">Patterns</p>
            <div className="space-y-2.5">
              {[
                ["emotional",  "Emotional"],
                ["venting",    "Venting"],
                ["advice",     "Advice"],
                ["solution",   "Solution"],
              ].map(([key, label]) => (
                <PatternBar key={key} label={label} value={patterns[key] || 0} max={patternMax} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-auto space-y-2">
          <button
            onClick={clearChat}
            className="w-full text-left text-xs text-ink-600 hover:text-ink-400 px-3 py-2 rounded-xl hover:bg-ink-800/50 transition-colors"
          >
            Clear chat
          </button>

          {/* User info */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-800/50 border border-ink-800">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-ink-700 flex items-center justify-center text-xs text-ink-400">
                {user.email?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-ink-400 text-xs truncate flex-1">
              {user.displayName || user.email?.split("@")[0]}
            </span>
            <button onClick={logout} className="text-ink-600 hover:text-ink-400 text-xs transition-colors">
              ↩
            </button>
          </div>
        </div>
      </aside>

      {/* ── Chat area ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="border-b border-ink-800 px-6 py-4 flex items-center justify-between bg-ink-900/50 backdrop-blur-sm">
          <div>
            <h1 className="font-display text-ink-100 text-lg">
              {user.displayName ? `Hey, ${user.displayName.split(" ")[0]}` : "Hey there"}
            </h1>
            <p className="text-ink-500 text-xs mt-0.5">I'm here whenever you need me</p>
          </div>
          <div className="text-ink-700 text-xs font-mono">
            {messages.length > 0 ? `${messages.length} messages` : "new session"}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center text-2xl text-sage-400 mb-4">
                ◈
              </div>
              <h2 className="font-display text-ink-300 text-xl mb-2">What's on your mind?</h2>
              <p className="text-ink-600 text-sm max-w-xs leading-relaxed">
                Share anything — I'll listen, support you, and adapt to what you need.
              </p>
              <div className="flex gap-2 mt-6 flex-wrap justify-center">
                {[
                  "I feel overwhelmed today",
                  "I need a plan to improve",
                  "I just needed to vent",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                    className="text-xs text-ink-500 border border-ink-800 hover:border-ink-700 hover:text-ink-300 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} onFeedback={sendFeedback} />
          ))}

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-ink-800 px-4 py-4 bg-ink-900/50 backdrop-blur-sm">
          <div className="flex gap-3 items-end max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(e); }}
              onKeyDown={handleKey}
              placeholder="Share what's on your mind..."
              rows={1}
              className="flex-1 bg-ink-800 border border-ink-700 focus:border-ink-600 text-ink-100 placeholder-ink-600 text-sm py-3 px-4 rounded-2xl outline-none resize-none transition-colors leading-relaxed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-sage-500 hover:bg-sage-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all flex-shrink-0"
            >
              ↑
            </button>
          </div>
          <p className="text-center text-ink-700 text-xs mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </main>
    </div>
  );
}
