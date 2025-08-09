import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import Typography from "../../components/atoms/Typography";
import { CustomButton as Button } from "../../components/atoms/CustomButton";
import * as analysisService from "../../api/analysisService";
import type { AiModel } from "../../api/analysisService";
import { BasicSettings } from "./settings/BasicSettings";
import { AdvancedSettings } from "./settings/AdvancedSettings";

const DEFAULT_MODEL_ID = "models/gemini-2.0-flash-lite";

// --- PROPS DEFINITION ---
export interface AnalysisSettings {
  contentType: string[];
  includedExtensions: string[];
  modelId: string;
}

type AiSettingsProps = {
  repoUrl: string;
  onAnalyze: (settings: AnalysisSettings) => void;
  onBack: () => void;
  isLoading: boolean; // This is the final analysis loading state from the parent
};

export const Step2_AiSettings: React.FC<AiSettingsProps> = ({
  repoUrl,
  onAnalyze,
  onBack,
  isLoading,
}) => {
  // --- STATE MANAGEMENT ---
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<AiModel[]>([]);

  // Data state
  const [availableExtensions, setAvailableExtensions] = useState<string[]>([]);

  // User selections
  const [contentTypes, setContentTypes] = useState<string[]>(['All']);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [includedExtensions, setIncludedExtensions] = useState<Set<string>>(
    new Set()
  );

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      // Fetch models and file extensions in parallel for efficiency
      const [modelsResponse, extensionsResponse] = await Promise.all([
        analysisService.getModels(),
        analysisService.getRepoFileExtensions(repoUrl),
      ]);
      setModels(modelsResponse.data);
      setAvailableExtensions(extensionsResponse.data.extensions);
      // Default to all extensions being selected
      setIncludedExtensions(new Set(extensionsResponse.data.extensions));
    } catch (err) {
      console.error("Failed to fetch settings data:", err);
      setError(
        "Could not load repository data or AI models. Please try again."
      );
    } finally {
      setIsFetching(false);
    }
  }, [repoUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // If models are fetched, set the default selected model as "models/gemini-2.0-flash-lite",
    // fallback to the first model in the list, fallback to an empty string, if not- set selectedModel to an empty string
    if (models?.length === 0) {
      setSelectedModel("");
    } else {
      setSelectedModel(
        models?.find((model) => model.id === DEFAULT_MODEL_ID)?.id ||
          models[0]?.id ||
          ""
      );
    }
  }, [models]);

  // --- EVENT HANDLERS ---
  const handleExtensionChange = (extension: string) => {
    setIncludedExtensions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(extension)) {
        newSet.delete(extension);
      } else {
        newSet.add(extension);
      }
      return newSet;
    });
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // If "All" is checked, select all available extensions
      setIncludedExtensions(new Set(availableExtensions));
    } else {
      // If "All" is unchecked, clear all selections
      setIncludedExtensions(new Set());
    }
  };

  const handleContentTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string[]
  ) => {
    // If the user selects "All", it should be the only item selected.
    // We check if "All" was just added to the selection.
    if (newSelection.includes('All') && !contentTypes.includes('All')) {
      setContentTypes(['All']);
      return;
    }

    // If the user clicks any other button, "All" should be removed.
    const selectionWithoutAll = newSelection.filter(item => item !== 'All');

    // If the user deselects everything, default back to "All".
    if (selectionWithoutAll.length === 0) {
      setContentTypes(['All']);
    } else {
      setContentTypes(selectionWithoutAll);
    }
  };
  
  const handleAnalyzeClick = () => {
    onAnalyze({
      modelId: selectedModel,
      includedExtensions: Array.from(includedExtensions),
      // Pass the content types array directly
      contentType: contentTypes,
    });
  };

  // --- RENDER LOGIC ---
  if (isFetching) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  //   if (error) {
  //     return (
  //       <Alert
  //         severity="error"
  //         action={<Button onClick={fetchData}>Retry</Button>}
  //       >
  //         {error}
  //       </Alert>
  //     );
  //   }

  return (
    <div className="w-full max-w-3xl animate-fade-in space-y-4">
      <Box className="text-center mb-8">
        <Typography variant="h4" component="h2" className="!font-bold">
          AI Analysis Settings
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 truncate"
        >
          Analyzing: <span className="font-mono">{repoUrl}</span>
        </Typography>
      </Box>

      {/* --- RENDER THE EXTRACTED COMPONENTS --- */}
      <BasicSettings
        selectedTypes={contentTypes}
        onChange={handleContentTypeChange}
      />
      <AdvancedSettings
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        availableExtensions={availableExtensions}
        includedExtensions={includedExtensions}
        onExtensionChange={handleExtensionChange}
        onSelectAllChange={handleSelectAllChange}
      />

      {/* --- Action Buttons --- */}
      <Box className="flex justify-between items-center mt-8">
        <Button variant="text" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          theme="secondary"
          size="large"
          onClick={handleAnalyzeClick}
          disabled={!selectedModel || isLoading}
          loading={isLoading}
        >
          Analyze Now
        </Button>
      </Box>
    </div>
  );
};
