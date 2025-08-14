import { useState } from "react";
import { Alert } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Step1_RepoInput } from "./Step1_RepoInput";
import Button from "../../components/atoms/Button";
import * as analysisService from "../../api/analysisService";
import { Step2_AiSettings, type AnalysisSettings } from "./Step2_AiSettings";
import GlowingSpinner from "../../components/atoms/GlowingSpinner";
import { type StagedAnalysisResponse } from "../../api/analysisService"; 
type AnalysisStep = "INPUT" | "MODEL_SELECTION" | "RESULT";

const Analyzer: React.FC = () => {
  const navigate = useNavigate(); // NEW

  const [step, setStep] = useState<AnalysisStep>("INPUT");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");

  const [url, setUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRepoSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
    setStep("MODEL_SELECTION");
  };

 const handleAnalyze = async (settings: AnalysisSettings) => {
    setIsLoading(true);
    setError(null);

    try {
      // STEP 1: Call analyzeRepo ONCE to get the temporary ID.
      const stageResponse: StagedAnalysisResponse = (await analysisService.analyzeRepo(
        url,
        settings.modelId,
        {
          contentType: settings.contentType,
          includedExtensions: settings.includedExtensions,
        }
      )).data;

      const tempId = stageResponse.tempId;

      // STEP 2: Use that ID to pre-fetch the full data.
      const analysisData = (await analysisService.getAnalysisById(tempId)).data;

      // STEP 3: Navigate to the viewer page.
      // - The 'tempId' goes in the URL.
      // - The full 'analysisData' is passed in the navigation state object.
      navigate(`/analysis/view/${tempId}`, { state: { analysis: analysisData } });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      // Make sure the loader stops on an error.
      setIsLoading(false); 
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <GlowingSpinner />
        </div>
      );
    }
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setError(null);
                setStep("MODEL_SELECTION");
              }}
            >
              TRY AGAIN
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    switch (step) {
      case "INPUT":
        return (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <Step1_RepoInput onUrlSubmit={handleRepoSubmit} />
          </motion.div>
        );
      case "MODEL_SELECTION":
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <Step2_AiSettings
              setRepoName={setRepoName}
              repoUrl={url}
              repoName={repoName}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              onAnalyze={handleAnalyze}
              onBack={() => setStep("INPUT")}
              isLoading={isLoading}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-full w-full flex flex-col items-center justify-center p-2 md:py-4 px-0 md:px-4 ">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-8 shadow-lg min-h-[380px] sm:min-h-[400px]">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </main>
  );
};

export default Analyzer;
