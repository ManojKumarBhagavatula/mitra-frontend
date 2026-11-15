// src/hooks/useChat.js
import { useState, useCallback } from "react";
import axios from "axios";
import { auth } from "../firebase";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in to use Mitra.");
  }

  const idToken = await user.getIdToken();
  return { Authorization: `Bearer ${idToken}` };
}

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
      const headers = await getAuthHeaders();
      const { data } = await axios.post(
        `${API_URL}/chat`,
        {
          session_id: sessionId || userId,
          message: text,
          mode,
        },
        { headers }
      );

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
      console.error("Mitra chat request failed", {
        url: `${API_URL}/chat`,
        status: err.response?.status,
        response: err.response?.data,
        message: err.message,
      });

      const userMessage =
        err.response?.status === 401
          ? "Your session has expired. Please sign in again."
          : err.response?.status === 500 || err.response?.status === 502
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
    } finally {
      setLoading(false);
    }
  }, [sessionId, userId]);

  const sendFeedback = useCallback(async (messageId, rating) => {
    try {
      const headers = await getAuthHeaders();
      await axios.post(
        `${API_URL}/feedback`,
        {
          session_id: sessionId || userId,
          message_id: messageId,
          rating,
        },
        { headers }
      );
    } catch (err) {
      console.error("Mitra feedback request failed", err.response?.data || err.message);
    }
  }, [sessionId, userId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setPatterns({});
    setModeUsed("auto");
  }, []);

  return { messages, loading, patterns, modeUsed, sendMessage, sendFeedback, clearChat };
}
