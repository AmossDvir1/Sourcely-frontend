import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "@mui/material";
import Typography from "../../components/atoms/Typography";
import Button from "../../components/atoms/Button";
import * as analysisService from "../../api/analysisService";
import type { AiModel } from "../../api/analysisService";
import { BasicSettings } from "./settings/BasicSettings";
import { AdvancedSettings } from "./settings/AdvancedSettings";
import GlowingSpinner from "../../components/atoms/GlowingSpinner";

const DEFAULT_MODEL_ID = "models/gemini-2.0-flash-lite";

// --- PROPS DEFINITION ---
export interface AnalysisSettings {
  contentType: string[];
  includedExtensions: string[] | null;
  modelId: string;
}

type AiSettingsProps = {
  repoUrl: string;
  repoName: string;
  onAnalyze: (settings: AnalysisSettings) => void;
  onBack: () => void;
  isLoading: boolean;
  setSelectedModel: (modelId: string) => void;
  selectedModel: string;
  setRepoName: (name: string) => void;
  onSettingsFetched: (repoName: string, codebase: string) => void; 
};

const individualContentTypes = [
  "General Description",
  "instructions-file",
  "Project File Tree",
];

export const Step2_AiSettings: React.FC<AiSettingsProps> = ({
  repoUrl,
  repoName,
  onAnalyze,
  onBack,
  isLoading,
  setSelectedModel,
  selectedModel,
  setRepoName,
  onSettingsFetched
}) => {
  // --- STATE MANAGEMENT (No changes needed here) ---
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<AiModel[]>([]);
  const [availableExtensions, setAvailableExtensions] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([...individualContentTypes, "All"]);
  const [includedExtensions, setIncludedExtensions] = useState<string[]>([
    "All",
  ]);

  // --- DATA FETCHING & EVENT HANDLERS (No changes needed here) ---
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const [modelsResponse, repoDataResponse] = await Promise.all([
        analysisService.getModels(),
        analysisService.getRepoData(repoUrl),
      ]);
      const fetchedExtensions = repoDataResponse.data.extensions;
      const fetchedRepoName = repoDataResponse.data.repoName;
      const fetchedRepoCodebase = repoDataResponse.data.codebase;

      setModels(modelsResponse.data);
      onSettingsFetched(fetchedRepoName, fetchedRepoCodebase); 
      setAvailableExtensions(fetchedExtensions);
      setRepoName(fetchedRepoName);
      setIncludedExtensions(["All", ...fetchedExtensions]);
    } catch (err) {
      console.error("Failed to fetch settings data:", err);
      setError("Could not load repository data or AI models. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }, [repoUrl, onSettingsFetched, setRepoName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (models?.length === 0) {
      setSelectedModel("");
    } else {
      setSelectedModel(
        models?.find((model) => model.id === DEFAULT_MODEL_ID)?.id ||
          models[0]?.id ||
          ""
      );
    }
  }, [models, setSelectedModel]);

  const handleExtensionChange = (_: React.MouseEvent<HTMLElement>, newSelection: string[]) => {
    if (availableExtensions.length === 1){
      return;
    }
    if (newSelection.includes("All") && !includedExtensions.includes("All")) {
      setIncludedExtensions(["All", ...availableExtensions]);
      return;
    }
    const selectionWithoutAll = newSelection.filter((item) => item !== "All");
    if (selectionWithoutAll.length === availableExtensions.length) {
      setIncludedExtensions(["All", ...availableExtensions]);
      return;
    }
    if (selectionWithoutAll.length === 0 && newSelection.length === 0) {
      setIncludedExtensions(["All", ...availableExtensions]);
      return;
    }
    if (includedExtensions.length === availableExtensions.length + 1) {
      const itemToSelect = availableExtensions.filter(
        (item) => !selectionWithoutAll.includes(item)
      );
      setIncludedExtensions([...(itemToSelect ?? "All")]);
      return;
    }
    setIncludedExtensions(selectionWithoutAll);
  };

  const handleContentTypeChange = (_: React.MouseEvent<HTMLElement>, newSelection: string[]) => {
    if (newSelection.includes("All") && !contentTypes.includes("All")) {
      setContentTypes(["All", ...individualContentTypes]);
      return;
    }
    const selectionWithoutAll = newSelection.filter((item) => item !== "All");
    if (selectionWithoutAll.length === individualContentTypes.length) {
      setContentTypes(["All", ...individualContentTypes]);
      return;
    }
    if (selectionWithoutAll.length === 0 && newSelection.length === 0) {
      setContentTypes(["All", ...individualContentTypes]);
      return;
    }
    if (contentTypes.length === individualContentTypes.length + 1) {
      const itemToSelect = individualContentTypes.filter(
        (item) => !selectionWithoutAll.includes(item)
      );
      setContentTypes(itemToSelect);
      return;
    }
    setContentTypes(selectionWithoutAll);
  };

  const handleAnalyzeClick = () => {
    const extensionsPayload = includedExtensions.includes("All") ? null : includedExtensions;
    onAnalyze({
      modelId: selectedModel,
      includedExtensions: extensionsPayload,
      contentType: contentTypes,
    });
  };

  // --- RENDER LOGIC ---
  if (isFetching) return <div className="flex items-center justify-center"><GlowingSpinner></GlowingSpinner></div>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="w-full max-w-3xl animate-fade-in space-y-4">
      <div className="text-center mb-6 sm:mb-8">
        <Typography variant="h4" component="h2" className="font-medium !text-2xl sm:!text-3xl lg:!text-4xl">
          AI Analysis Settings
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 truncate"
        >
          Analyzing: <span className="font-mono">{repoName ?? repoUrl}</span>
        </Typography>
      </div>

      <BasicSettings
        selectedTypes={contentTypes}
        onChange={handleContentTypeChange}
        contentTypes={individualContentTypes}
      />
      <AdvancedSettings
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        availableExtensions={availableExtensions}
        selectedExtensions={includedExtensions}
        onExtensionChange={handleExtensionChange}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 mt-6 sm:mt-8">
        <Button
          variant="text"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          theme="secondary"
          size="large"
          onClick={handleAnalyzeClick}
          disabled={!selectedModel || isLoading}
          loading={isLoading}
          className="w-full sm:w-auto"
        >
          Analyze Now
        </Button>
      </div>
    </div>
  );
};