import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, IconButton, Alert, Dialog } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "../components/atoms/Typography";
import GlowingSpinner from "../components/atoms/GlowingSpinner";
import * as analysisService from "../api/analysisService";
import { useChatSocket } from "../hooks/useChatSocket";
import { useResponsive } from "../hooks/useResponsive";
import ChatTextField from "../components/atoms/ChatTextField";

type IndexingStatus = "preparing" | "ready" | "error";

const ChatPage = () => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // Use the hook to check screen size

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
        const status = response.data.status;

        if (status === "ready" || status === "error") {
          setIndexingStatus(status);
          if (status === "ready") {
            // Use suggestions from API, fallback to empty array if none are provided
            setSuggestions(response.data.suggestions || []);
          }
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
    }, 2000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [sessionId]);

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setShowSuggestions(false); // Hide suggestions after one is used
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // If the user starts typing, hide the suggestions permanently
    // if (e.target.value) {
    //   setShowSuggestions(false);
    // }
  };

  const handleSendMessage = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const renderStatus = () => {
    // This function renders the status (preparing, error) and is shared by both layouts
    switch (indexingStatus) {
      case "preparing":
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 h-full">
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
        return null;
    }
  };

  const messageList = (
    // This JSX for the list of messages is identical for both layouts
    <>
      {messages.map((msg) => (
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
    </>
  );

  //================================================
  // RENDER MOBILE VIEW (FULL-SCREEN DIALOG)
  //================================================
  if (isMobile) {
    return (
      <Dialog fullScreen open={true}>
        <div className="flex flex-col h-full bg-bg-default text-text-primary">
          <Paper
            square
            elevation={2}
            className="flex-shrink-0 flex items-center p-2 bg-bg-paper border-b border-border"
          >
            <IconButton onClick={handleGoBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className="font-medium ml-2 text-base">
              Repository Chat
            </Typography>
          </Paper>

          <div className="flex-grow p-2 overflow-y-auto space-y-2">
            {indexingStatus !== "ready" ? renderStatus() : messageList}
          </div>
          <ChatTextField
            showSuggestions={showSuggestions}
            indexingStatus={indexingStatus}
            suggestions={suggestions}
            inputValue={inputValue}
            isConnected={isConnected}
            onInputChange={handleInputChange}
            onSuggestionClick={handleSuggestionClick}
            onSendMessage={handleSendMessage}
          />
        </div>
      </Dialog>
    );
  }

  //================================================
  // RENDER DESKTOP VIEW (STANDARD LAYOUT)
  //================================================
  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto">
      <Typography
        variant="h4"
        className="text-center mb-2 sm:mb-4 text-2xl sm:text-4xl font-bold"
      >
        Repository Chat
      </Typography>

      <Paper className="flex-grow p-2 sm:p-4 overflow-y-auto bg-bg-paper-light space-y-2 sm:space-y-4">
        {indexingStatus !== "ready" ? renderStatus() : messageList}
      </Paper>
      <ChatTextField
        showSuggestions={showSuggestions}
        indexingStatus={indexingStatus}
        suggestions={suggestions}
        inputValue={inputValue}
        isConnected={isConnected}
        onInputChange={handleInputChange}
        onSuggestionClick={handleSuggestionClick}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;
