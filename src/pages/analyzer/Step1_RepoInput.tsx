import { useState } from "react";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "../../components/atoms/Button";
import Typography from "../../components/atoms/Typography";
import TextField from "../../components/atoms/TextField";
import { Divider } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
// --- 1. IMPORT THE NEW GENERIC COMPONENT AND ITS TYPE ---
import { ModeSwitcher, type ModeOption } from "../../components/ModeSwitcher";

type AgentMode = 'fast' | 'smart';

type Props = {
  onUrlSubmit: (url: string) => void;
  onChatSubmit: (url: string, agentMode: AgentMode) => void;
};

const GITHUB_URL_REGEX =
  /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

// --- 2. DEFINE THE OPTIONS CONFIGURATION ---
// This keeps the configuration clean and separate from the JSX.
const agentModeOptions: [ModeOption, ModeOption] = [
  {
    value: 'fast',
    label: 'Fast',
    description: 'Quick, for specific questions.',
    theme: 'secondary',
    icon: <Typography className="!text-lg">⚡️</Typography>,
  },
  {
    value: 'smart',
    label: 'Smart',
    description: 'Smart, for architectural questions.',
    theme: 'primary',
    icon: <Typography className="!text-lg">✨</Typography>,
  },
];

export const Step1_RepoInput = ({ onUrlSubmit, onChatSubmit }: Props) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [agentMode, setAgentMode] = useState<AgentMode>('smart');

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (GITHUB_URL_REGEX.test(url)) onUrlSubmit(url);
    else setError("Please enter a valid GitHub repository URL.");
  };

  const handleChatSubmit = () => {
    if (GITHUB_URL_REGEX.test(url)) {
      onChatSubmit(url, agentMode);
    } else {
      setError("Please enter a valid GitHub repository URL.");
    }
  };

  const handleChange = (newUrl: string) => {
    setUrl(newUrl);
    if (error) setError("");
  };

  return (
    <motion.div
      className="text-center w-full max-w-2xl flex flex-col items-center gap-y-4 md:gap-y-6"
      variants={containerVariants} initial="hidden" animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Typography code className="text-xl sm:text-4xl font-bold text-text-primary">Analyze a Repository</Typography>
      </motion.div>

      <motion.ul className="space-y-2 text-left" variants={itemVariants}>
        {[ "AI-Powered Summaries", "Detailed Setup Instructions", "Full Architecture Overview" ].map((item) => (
          <li key={item} className="flex items-center gap-x-3">
            <CheckCircleIcon className="text-secondary" />
            <Typography className="text-text-secondary text-sm">{item}</Typography>
          </li>
        ))}
      </motion.ul>
      
      <Divider className="flex w-full mt-0 mb-3" />

      <motion.form className="flex flex-col items-center gap-4 w-full" variants={itemVariants}>
        <TextField
          label="Enter a Public GitHub Repository URL"
          fullWidth value={url} error={!!error} helperText={error || " "}
          onChange={(e) => handleChange(e.target.value)}
          slotProps={{input: {startAdornment: <GitHubIcon sx={{ mr: 1, color: "var(--color-text-secondary)" }} />}}}
        />
        
        <Button
          type="submit" onClick={handleAnalyzeSubmit} disabled={!url}
          className="w-56 max-w-lg md:w-48 !h-10"
        >
          Analyze
        </Button>
        <Divider className="w-1/2 my-0 text-text-secondary">OR</Divider>

        {/* --- 3. RENDER THE GENERIC COMPONENT WITH OUR CONFIGURATION --- */}
        <motion.div variants={itemVariants}>
          <ModeSwitcher
            label="Chat Agent Mode"
            value={agentMode}
            onChange={(newMode) => setAgentMode(newMode as AgentMode)}
            options={agentModeOptions}
          />
        </motion.div>

        <Button
          onClick={handleChatSubmit} disabled={!url} theme="secondary"
          startIcon={<ChatIcon />} className="w-56 max-w-lg md:w-48 !h-10"
        >
          Chat about Repo
        </Button>
      </motion.form>
    </motion.div>
  );
};