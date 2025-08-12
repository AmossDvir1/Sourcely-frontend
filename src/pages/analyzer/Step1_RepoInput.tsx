import { useState } from "react";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Using an icon for the checklist
import Button from "../../components/atoms/Button";
import Typography from "../../components/atoms/Typography";
import TextField from "../../components/atoms/TextField";
import { Divider } from "@mui/material";

type Props = {
  onUrlSubmit: (url: string) => void;
};

const GITHUB_URL_REGEX =
  /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;

// Animation variants for a staggered effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const Step1_RepoInput = ({ onUrlSubmit }: Props) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (GITHUB_URL_REGEX.test(url)) {
      onUrlSubmit(url);
    } else {
      setError("Please enter a valid GitHub repository URL.");
    }
  };

  const handleChange = (newUrl: string) => {
    setUrl(newUrl);
    if (error) {
      setError("");
    }
  };

  return (
    <motion.div
      className="text-center w-full max-w-2xl flex flex-col items-center gap-y-4 md:gap-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. NEW: Action-oriented title */}
      <motion.div variants={itemVariants}>
        <Typography
          code
          className="text-xl sm:text-4xl font-bold text-text-primary"
        >
          Analyze a Repository
        </Typography>
      </motion.div>

      {/* 2. NEW: Value proposition checklist */}
      <motion.ul className="space-y-2 md:space-y-3 text-left " variants={itemVariants}>
        {[
          "AI-Powered Summaries",
          "Detailed Setup Instructions",
          "Full Architecture Overview",
        ].map((item) => (
          <li key={item} className="flex items-center gap-x-3">
            <CheckCircleIcon className="text-secondary" />
            <Typography className="text-text-secondary text-sm">{item}</Typography>
          </li>
        ))}
      </motion.ul>
<Divider className="flex w-full mt-0 mb-3"></Divider>
      {/* 3. UPDATED: Form with themed TextField */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
        variants={itemVariants}
      >
        <TextField
          label="Enter a Public GitHub Repository URL"
          fullWidth
          value={url}
          error={!!error}
          helperText={error || " "}
          onChange={(e) => handleChange(e.target.value)}

          slotProps={{
            input: {
              startAdornment: (
                <GitHubIcon
                  sx={{ mr: 1, color: "var(--color-text-secondary)" }}
                />
              ),
            },
          }}
        />
        {/* <Divider className="flex w-full mb-3"></Divider> */}

        <Button
          type="submit"
          // size="large"
          disabled={!url}
          className="w-56 max-w-lg md:w-48 md:h-12 !h-10"
        >
          Analyze
        </Button>
      </motion.form>
    </motion.div>
  );
};
