// src/hooks/useChat.js
import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export function useChat(userId) {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [patterns, setPatterns] = useState({});
  const [modeUsed, setModeUsed] = useState("auto");
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text, mode = "auto") => {
    setMessages((prev) => [...prev, { role: "user", content: text, id: Date.now() }]);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/chat`, {
        session_id: sessionId || userId,
        message: text,
        mode,
      });

      setSessionId(data.session_id);
      setPatterns(data.patterns);
      setModeUsed(data.mode_used);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          mode: data.mode_used,
          messageId: data.message_id,
          sessionId: data.session_id,
          id: Date.now() + 1,
        },
      ]);
    } catch (err) {
      // Log the diagnostic details without exposing server internals in the UI.
      console.error("Mitra chat request failed", {
        url: `${API_URL}/chat`,
        status: err.response?.status,
        response: err.response?.data,
        message: err.message,
      });

      const detail = err.response?.data?.detail;
      const userMessage =
        err.response?.status === 500
          ? "Mitra's server encountered an error. Please try again later."
          : err.response?.status
            ? `Request failed (HTTP ${err.response.status}). Please try again.`
            : "Unable to reach Mitra's server. Check your connection and try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: userMessage,
          mode: "error",
          id: Date.now() + 1,
        },
      ]);

      // Keep backend detail in the console for debugging only.
      if (detail) console.error("Mitra backend detail:", detail);
    } finally {
      setLoading(false);
    }
  }, [sessionId, userId]);

  const sendFeedback = useCallback(async (messageId, rating) => {
    try {
      await axios.post(`${API_URL}/feedback`, {
        session_id: sessionId,
        message_id: messageId,
        rating,
      });
    } catch (e) {
      console.error("Feedback error", e.response?.data || e.message);
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setPatterns({});
    setModeUsed("auto");
  }, []);

  return { messages, loading, patterns, modeUsed, sendMessage, sendFeedback, clearChat };
}
