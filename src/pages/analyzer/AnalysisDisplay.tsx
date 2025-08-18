import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Paper, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckIcon from "@mui/icons-material/Check";
import {
  SaveAnalysisDialog,
  type AnalysisSaveData,
} from "./SaveAnalysisDialog";
import Button from "../../components/atoms/Button";
import Typography from "../../components/atoms/Typography";
import RegisterToSaveDialog from "../RegisterToSaveDialog";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Switch } from "../../components/atoms/Switch";
import { useResponsive } from "../../hooks/useResponsive";

interface AnalysisDisplayProps {
  analysis: string;
  onReset: () => void;
  repoName: string;
  repoUrl: string;
  onSave: (data: AnalysisSaveData) => Promise<void>;
  model: string;
  codebase: string;
  showCodebase: boolean;
  onToggleCodebase: () => void;
  isSaved: boolean;
  onDelete: () => Promise<void>; 
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  analysis,
  repoName,
  onReset,
  onSave,
  model,
  codebase,
  showCodebase,
  onToggleCodebase,
  isSaved,
  onDelete
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Get current location
  const { isMobile } = useResponsive();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false); // State for new dialog
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const [isFavorite, setIsFavorite] = useState(isSaved);

  useEffect(() => {
    setIsFavorite(isSaved);
  }, [isSaved]);

  const handleCopy = async () => {
    const contentToCopy = showCodebase
      ? `${codebase}\n\n${analysis}`
      : analysis;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSaveClick = () => {
    if (isAuthenticated) {
      setIsSaveDialogOpen(true);
    } else {
      setIsRegisterDialogOpen(true);
    }
  };

  const handleFavoriteToggle = async () => {
    if (isFavorite) {
      // If it's already a favorite, call the delete handler
      await onDelete();
      setIsFavorite(false);
    } else {
      // Otherwise, trigger the save process
      handleSaveClick();
    }
  };

  // This is the new function passed to the save dialog
  const handleConfirmSave = async (data: AnalysisSaveData) => {
    await onSave(data); // Call the parent's save logic
    setIsFavorite(true); // Instantly update the heart icon
  };

  return (
    <>
      <SaveAnalysisDialog
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleConfirmSave}
        repoName={repoName}
        analysisContent={analysis}
        modelUsed={model}
      />
      <RegisterToSaveDialog
        open={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        analysisUrl={location.pathname}
      />

      <div className="w-full animate-fade-in">
        <Paper
          elevation={5}
          // THEME UPDATE: Use theme variables for the background.
          // This gives a slightly transparent, glassy look that matches your theme.
          className="bg-bg-paper-light dark:bg-bg-paper/50 backdrop-blur-md border border-border-glass rounded-xl overflow-hidden"
        >
          {/* THEME UPDATE: Use theme border color. */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border">
            {/* THEME UPDATE: Use secondary text color for less emphasis. */}
            <Typography code className="!font-mono text-sm text-text-secondary">
              {isMobile ? "Result" : "AI Analysis Result"}
            </Typography>
            <div className="flex items-center gap-x-2">
              <Switch
                size="small"
                checked={showCodebase}
                onChange={onToggleCodebase}
                label={isMobile ? "Codebase" : "Include Codebase"}
              />
              <Tooltip
                title={
                  copyStatus === "copied" ? "Copied!" : "Copy to Clipboard"
                }
              >
                <IconButton onClick={handleCopy} size="small">
                  {copyStatus === "copied" ? (
                    <CheckIcon
                      sx={{ color: "var(--color-success)" }}
                      fontSize="small"
                    />
                  ) : (
                    <ContentCopyIcon
                      className="text-text-secondary hover:text-primary"
                      fontSize="small"
                    />
                  )}
                </IconButton>
              </Tooltip>
               <Tooltip title={isFavorite ? "Remove from saved" : "Save analysis"}>
                <IconButton onClick={handleFavoriteToggle} size="small">
                  {isFavorite ? (
                    <FavoriteIcon className="text-primary" fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon className="text-text-secondary hover:text-primary" fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="p-4 sm:p-6 max-h-[50vh] md:max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* THEME UPDATE: Use dark:prose-invert to automatically handle themes. */}
            <article className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>
                {showCodebase ? `${codebase}\n\n${analysis}` : analysis}
              </ReactMarkdown>
            </article>
          </div>
        </Paper>

        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={onReset} className="w-full sm:w-auto">
            Analyze Another Repository
          </Button>
        </div>
      </div>
    </>
  );
};

export default AnalysisDisplay;
