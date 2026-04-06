// app/components/ChatBot.js
// Floating chatbot widget for the citizen portal

"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useLang } from "../lib/LanguageContext";

export default function ChatBot() {
  const { t, lang } = useLang();

  const SUGGESTIONS = [t.suggestion1, t.suggestion2, t.suggestion3, t.suggestion4];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: t.chatGreeting },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevLangRef = useRef(lang);

  // Reset greeting when language changes
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      if (messages.length === 1) {
        setMessages([{ role: "bot", content: t.chatGreeting }]);
      }
    }
  }, [lang, t.chatGreeting, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isTyping) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Build history (skip the initial bot greeting)
      const history = newMessages
        .slice(1)
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          content: m.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lang === "ml"
            ? `(Respond in Malayalam language) ${userMessage}`
            : userMessage,
          history,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
            isError: true,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Network error. Please check your connection and try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown-like formatting
  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*)/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.*)/gm, "<li>$2</li>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      .replace(/<\/ul>\s*<ul>/g, "")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        id="chatbot-toggle"
        aria-label="Toggle health chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className="chatbot-toggle-badge">AI</span>}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`} id="chatbot-window">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <Bot size={20} />
            </div>
            <div>
              <div className="chatbot-name">{t.healthAssistant}</div>
              <div className="chatbot-status">
                <span className="chatbot-status-dot" />
                {t.poweredByGemini}
              </div>
            </div>
          </div>
          <button
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages" id="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chatbot-msg ${msg.role} ${msg.isError ? "error" : ""}`}
            >
              <div className="chatbot-msg-avatar">
                {msg.role === "bot" ? (
                  <Bot size={14} />
                ) : (
                  <User size={14} />
                )}
              </div>
              <div className="chatbot-msg-bubble">
                {msg.role === "bot" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="chatbot-msg bot">
              <div className="chatbot-msg-avatar">
                <Bot size={14} />
              </div>
              <div className="chatbot-msg-bubble typing">
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          {/* Suggestions (only show if no user messages yet) */}
          {messages.length === 1 && !isTyping && (
            <div className="chatbot-suggestions">
              <div className="chatbot-suggestions-label">
                <Sparkles size={12} /> {t.trySuggestions}
              </div>
              {SUGGESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="chatbot-suggestion-chip"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer */}
        <div className="chatbot-disclaimer">
          <AlertCircle size={11} />
          {t.aiDisclaimer}
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder={t.askHealthQuestion}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            id="chatbot-input"
          />
          <button
            className="chatbot-send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            id="chatbot-send"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
