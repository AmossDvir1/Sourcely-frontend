import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Paper, TextField, IconButton, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Typography from "../components/atoms/Typography";
import GlowingSpinner from "../components/atoms/GlowingSpinner";
import * as analysisService from "../api/analysisService";

type IndexingStatus = "preparing" | "ready" | "error";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const ChatPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [indexingStatus, setIndexingStatus] =
    useState<IndexingStatus>("preparing");
  const webSocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scrolling

  const pollingIntervalRef = useRef<number | null>(null);

  // Auto-scroll to the bottom of the messages list when it updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!sessionId) return;

    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const response = await analysisService.getChatStatus(sessionId);
        if (
          response.data.status === "ready" ||
          response.data.status === "error"
        ) {
          setIndexingStatus(response.data.status);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
        }
      } catch (error) {
        console.error("Failed to get chat status", error);
        setIndexingStatus("error");
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
    }, 800); // Poll every 3 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [sessionId]);

  // Effect for establishing WebSocket connection ONCE ready
  useEffect(() => {
    if (indexingStatus === "ready" && sessionId && !webSocketRef.current) {
      const wsUrl = `ws://localhost:3001/api/v1/code/ws/chat/${sessionId}`;
      const ws = new WebSocket(wsUrl);
      webSocketRef.current = ws;

      ws.onopen = () => console.log("WebSocket connected");
      ws.onmessage = (event) => {
        // Append streaming bot response
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.sender === "bot") {
            // Append to the last message
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              text: lastMessage.text + event.data,
            };
            return updatedMessages;
          } else {
            // Create a new bot message
            return [
              ...prev,
              { id: Date.now(), text: event.data, sender: "bot" },
            ];
          }
        });
      };
      ws.onclose = () => console.log("WebSocket disconnected");
      ws.onerror = (error) => console.error("WebSocket error:", error);
    }

    // Cleanup WebSocket on component unmount
    return () => {
      webSocketRef.current?.close();
    };
  }, [indexingStatus, sessionId]);

  const handleSendMessage = () => {
    if (
      inputValue.trim() &&
      webSocketRef.current?.readyState === WebSocket.OPEN
    ) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
      };
      setMessages((prev) => [...prev, userMessage]);
      webSocketRef.current.send(inputValue);
      setInputValue("");
    }
  };

  const renderStatus = () => {
    switch (indexingStatus) {
      case "preparing":
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <GlowingSpinner />
            <Typography variant="h6" className="mt-4">
              Preparing Repository...
            </Typography>
            <Typography color="text.secondary">
              This may take a moment for large repositories.
            </Typography>
          </div>
        );
      case "error":
        return (
          <Alert severity="error">
            Failed to prepare the chat session. Please try again.
          </Alert>
        );
      case "ready":
        return null; // Don't show anything, the chat is ready
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto">
      <Typography
        variant="h4"
        className="text-center mb-2 sm:mb-4 text-2xl sm:text-4xl font-bold"
      >
        Repository Chat
      </Typography>

      <Paper className="flex-grow p-2 sm:p-4 overflow-y-auto bg-bg-paper-light space-y-2 sm:space-y-4">
        {indexingStatus !== "ready"
          ? renderStatus()
          : messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Paper
                  className={`p-2 sm:p-3 max-w-[80%] sm:max-w-lg rounded-3xl ${
                    msg.sender === "user"
                      ? "bg-secondary text-on-secondary"
                      : "bg-bg-paper"
                  }`}
                >
                  <Typography
                    variant="body1"
                    className={`whitespace-pre-wrap text-sm sm:text-base ${
                      msg.sender === "user" ? "text-on-secondary" : ""
                    }`}
                  >
                    {msg.text}
                  </Typography>
                </Paper>
              </div>
            ))}
        <div ref={messagesEndRef} />
      </Paper>

      <div className="p-2 sm:p-4 bg-bg-paper border-t border-border">
<TextField
  fullWidth
  variant="outlined"
  placeholder="Ask a question about the code..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
  disabled={indexingStatus !== "ready"}
  InputProps={{
    endAdornment: (
      <IconButton
        onClick={handleSendMessage}
        disabled={indexingStatus !== "ready"}
        edge="end"
      >
        <SendIcon />
      </IconButton>
    ),
  }}
/>
      </div>
    </div>
  );
};

export default ChatPage;
