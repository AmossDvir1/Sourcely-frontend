import { Paper, Box, Alert } from "@mui/material";
import Typography from "../../components/atoms/Typography";
import { CustomButton } from "../../components/atoms/CustomButton";
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axiosClient";
import ModelCardSkeleton from "./ModelCardSkeleton";

export type AiModel = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  repoUrl: string;
  // Callback to start the analysis
  onAnalyze: (modelId: string) => void;
  // Callback to go back to the previous step
  onBack: () => void;
  isLoading: boolean;
};

export const Step2_ModelSelection = ({
  repoUrl,
  onAnalyze,
  onBack,
  isLoading,
}: Props) => {
  const [models, setModels] = useState<AiModel[]>([]);
  const [isFetching, setIsFetching] = useState(true); // Is this component fetching its own data?
  const [error, setError] = useState<string | null>(null);

  // We wrap the fetch logic in useCallback so the Retry button doesn't cause re-renders
  const fetchModels = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      // We use a generic for type-safe response data.
      const response = await api.get<AiModel[]>("/code/models");
      setModels(response.data);
    } catch (err) {
      console.error("Failed to fetch models:", err);
      setError(
        "Could not load AI models. Please check the network and try again."
      );
    } finally {
      setIsFetching(false);
    }
  }, []);

  // --- TRIGGER THE FETCH ON COMPONENT MOUNT ---
  useEffect(() => {
    fetchModels();
  }, [fetchModels]); // This effect runs once when the component mounts.
  const renderContent = () => {
    // 1. Loading State
    if (isFetching) {
      return (
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelCardSkeleton />
          <ModelCardSkeleton />
          <ModelCardSkeleton />
        </Box>
      );
    }

    // 2. Error State
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <CustomButton color="inherit" size="small" onClick={fetchModels}>
              RETRY
            </CustomButton>
          }
        >
          {error}
        </Alert>
      );
    }

    // 3. Success State
    return (
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => (
          <Paper
            key={model.id}
            variant="outlined"
            className="p-6 flex flex-col justify-between"
          >
            <div>
              <Typography variant="h6" className="!font-bold">
                {model.name}
              </Typography>
              <Typography variant="body2" className="mt-2 min-h-[70px]">
                {model.description}
              </Typography>
            </div>
            <CustomButton
              className="w-full mt-4"
              onClick={() => onAnalyze(model.id)}
              // Disable button if analysis is running OR if models are being fetched
              disabled={isLoading || isFetching}
              loading={isLoading} // Show loading state on button if analysis is running
            >
              Analyze with {model.name}
            </CustomButton>
          </Paper>
        ))}
      </Box>
    );
  };
  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <Box className="text-center mb-8">
        <Typography variant="h4" component="h2" className="!font-bold">
          Select an AI Model
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 truncate"
        >
          Analyzing: <span className="font-mono">{repoUrl}</span>
        </Typography>
      </Box>
      {renderContent()}

      <Box className="text-center mt-8">
        <CustomButton variant="text" onClick={onBack} disabled={isLoading}>
          Back
        </CustomButton>
      </Box>
    </div>
  );
};
