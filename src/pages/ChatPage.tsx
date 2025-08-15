import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Paper, IconButton, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Typography from "../components/atoms/Typography";
import GlowingSpinner from "../components/atoms/GlowingSpinner";
import * as analysisService from "../api/analysisService";
import TextField from "../components/atoms/TextField";
import { useChatSocket } from "../hooks/useChatSocket";

type IndexingStatus = "preparing" | "ready" | "error";

const ChatPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [inputValue, setInputValue] = useState("");
  const [indexingStatus, setIndexingStatus] =
    useState<IndexingStatus>("preparing");

  const { messages, isConnected, sendMessage } = useChatSocket({
    sessionId: sessionId || "",
    isReady: indexingStatus === "ready",
  });

  const pollingIntervalRef = useRef<number | null>(null);

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

  const handleSendMessage = () => {
    sendMessage(inputValue);
    setInputValue("");
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
      </Paper>

      <div className="p-2 sm:p-4 bg-bg-paper border-t border-border flex items-center gap-2">
        <TextField
          className="flex-1"
          placeholder="Ask a question about the code..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={indexingStatus !== "ready" || !isConnected}
        />
        <IconButton
          className="flex-shrink-0"
          onClick={handleSendMessage}
          disabled={
            !isConnected ||
            indexingStatus !== "ready" ||
            inputValue.trim().length === 0
          }
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatPage;
