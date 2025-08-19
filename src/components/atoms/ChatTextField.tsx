import { IconButton, Chip, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import TextField from "./TextField";

// ====================================================================
// 1. DEFINE THE STABLE CHAT INPUT COMPONENT (OUTSIDE)
// It now receives all its data and handlers as props.
// ====================================================================
interface ChatTextFieldProps {
  showSuggestions: boolean;
  indexingStatus: "preparing" | "ready" | "error";
  suggestions: string[];
  inputValue: string;
  isConnected: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestionClick: (suggestion: string) => void;
  onSendMessage: () => void;
}

const ChatTextField: React.FC<ChatTextFieldProps> = ({
  showSuggestions,
  indexingStatus,
  suggestions,
  inputValue,
  isConnected,
  onInputChange,
  onSuggestionClick,
  onSendMessage,
}) => {
  return (
    <div className="flex-shrink-0 p-2 sm:p-4 bg-bg-paper border-t border-border flex flex-col gap-2">
      {showSuggestions &&
        indexingStatus === "ready" &&
        suggestions.length > 0 && (
          <Box className="flex flex-wrap items-center gap-2 px-1 animate-fade-in">
            {suggestions.map((text) => (
              <Chip
                key={text}
                label={text}
                size="small"
                variant="outlined"
                onClick={() => onSuggestionClick(text)}
                sx={{
                  cursor: "pointer",
                  color: "var(--color-text-secondary)",
                  borderColor: "var(--color-border-light)",
                  "&:hover": {
                    backgroundColor: "var(--color-bg-hover)",
                    color: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                  },
                }}
              />
            ))}
          </Box>
        )}

      <div className="flex items-center gap-2">
        <TextField
          className="flex-1"
          placeholder="Ask a question about the code..."
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          disabled={indexingStatus !== "ready" || !isConnected}
        />
        <IconButton
          className="flex-shrink-0"
          onClick={onSendMessage}
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

export default ChatTextField;
