import { useState } from "react";
import { TextField } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { CustomButton } from "../../components/atoms/CustomButton";
import Typography from "../../components/atoms/Typography";

type Props = {
  onUrlSubmit: (url: string) => void;
};

const GITHUB_URL_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;

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
    <div className="text-center w-full max-w-2xl">
      <Typography className="text-4xl sm:text-5xl font-medium">Sourcely</Typography>
      <Typography className="text-base sm:text-lg text-gray-400 mt-2 mb-8 font-sans">
        Get an instant AI-powered summary of any public GitHub repository.
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <TextField
          label="Enter a Public GitHub Repository URL"
          variant="outlined"
          fullWidth
          value={url}
          error={!!error}
          helperText={error || " "}
          onChange={(e) => handleChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <GitHubIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />
        <CustomButton
          type="submit"
          size="large"
          disabled={!url}
          className="w-full sm:w-48 !h-12 !font-semibold"
        >
          Next
        </CustomButton>
      </form>
    </div>
  );
};