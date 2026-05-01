// src/hooks/useChat.js
import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export function useChat(userId) {
  const [messages, setMessages]     = useState([]);
  const [sessionId, setSessionId]   = useState(null);
  const [patterns, setPatterns]     = useState({});
  const [modeUsed, setModeUsed]     = useState("auto");
  const [loading, setLoading]       = useState(false);

  const sendMessage = useCallback(async (text, mode = "auto") => {
    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: text, id: Date.now() }]);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/chat`, {
        session_id: sessionId || userId, // use Firebase UID as session ID
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          mode: "error",
          id: Date.now() + 1,
        },
      ]);
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
      console.error("Feedback error", e);
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
