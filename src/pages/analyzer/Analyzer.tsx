import { useState } from "react";
import { Alert } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { Step1_RepoInput } from "./Step1_RepoInput";
import { AnalysisDisplay } from "./AnalysisDisplay";
import Button from "../../components/atoms/Button";
import type { AnalysisSaveData } from "./SaveAnalysisDialog";
import * as analysisService from "../../api/analysisService";
import { Step2_AiSettings, type AnalysisSettings } from "./Step2_AiSettings";
import GlowingSpinner from "../../components/atoms/GlowingSpinner";

type AnalysisStep = "INPUT" | "MODEL_SELECTION" | "RESULT";

const Analyzer: React.FC = () => {
  const [step, setStep] = useState<AnalysisStep>("INPUT");
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");

  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);

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
      const response = await analysisService.analyzeRepo(
        url,
        settings.modelId,
        {
          contentType: settings.contentType,
          includedExtensions: settings.includedExtensions,
        }
      );
      setAnalysis(response.data.analysis);
      setSourceCode(response.data.sourceCode);
      setStep("RESULT");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnalysis = async (data: AnalysisSaveData) => {
    if (!sourceCode) {
      throw new Error("Source code is not available to save.");
    }

    const saveData = {
      ...data,
      sourceCode: sourceCode,
    };

    try {
      await analysisService.saveAnalysis(saveData);
    } catch (error) {
      console.error("API call to save analysis failed:", error);
      throw error;
    }
  };

  const handleReset = () => {
    setStep("INPUT");
    setUrl("");
    setSelectedModel("");
    setAnalysis(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center"><GlowingSpinner></GlowingSpinner></div>;
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
      case "INPUT": {
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
      }
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

      case "RESULT": {
        return (
          analysis && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <AnalysisDisplay
                model={selectedModel}
                repoName={repoName}
                repoUrl={url}
                onSave={handleSaveAnalysis}
                analysis={analysis}
                onReset={handleReset}
              />
            </motion.div>
          )
        );
      }

      default: {
        const _exhaustiveCheck: never = step;
        return <div>Something went wrong: {_exhaustiveCheck}</div>;
      }
    }
  };

  return (
    <main className="min-h-full w-full flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-8 shadow-lg min-h-[380px] sm:min-h-[400px]">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </main>
  );
};

export default Analyzer;
