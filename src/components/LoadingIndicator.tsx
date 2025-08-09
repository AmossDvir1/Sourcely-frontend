// src/components/LoadingIndicator.tsx
import { CircularProgress, Typography } from '@mui/material';

export const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <CircularProgress size={60} />
      <Typography variant="h6" className="text-gray-300">
        Analyzing Repository...
      </Typography>
      <Typography variant="body1" className="text-gray-500">
        This might take a moment. We're cloning the repo and asking the AI for its insights.
      </Typography>
    </div>
  );
};