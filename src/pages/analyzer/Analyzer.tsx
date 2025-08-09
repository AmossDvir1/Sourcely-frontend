import { useState } from "react";
import { Alert } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { Step1_RepoInput } from "./Step1_RepoInput";
import { AnalysisDisplay } from "./AnalysisDisplay";
import { AnalysisSkeleton } from "./AnalysisSkeleton";
import { CustomButton } from "../../components/atoms/CustomButton";
import type { AnalysisSaveData } from "./SaveAnalysisDialog";
import * as analysisService from "../../api/analysisService";
import { Step2_AiSettings, type AnalysisSettings } from "./Step2_AiSettings";

type AnalysisStep = "INPUT" | "MODEL_SELECTION" | "RESULT";

const Analyzer: React.FC = () => {
  const [step, setStep] = useState<AnalysisStep>("INPUT");
  const [sourceCode, setSourceCode] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [model, setModel] = useState("");
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

      const response = await analysisService.analyzeRepo(url, settings.modelId, {contentType: settings.contentType, includedExtensions:settings.includedExtensions});
      setAnalysis(response.data.analysis);
      // You still need to manage sourceCode for the save dialog
      setSourceCode(response.data.sourceCode); 
      setStep('RESULT');
    } catch (err: unknown) {
      // Handle error as unknown, optionally narrow the type
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
    
    // Create the full payload for the service function
    const saveData = {
        ...data,
        sourceCode: sourceCode,
    };

    try {
      await analysisService.saveAnalysis(saveData);
      // Optionally show a success notification (snackbar)
    } catch (error) {
      console.error('API call to save analysis failed:', error);
      throw error;
    }
  };

  const handleReset = () => {
    setStep("INPUT");
    setUrl("");
    setModel("");
    setAnalysis(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisSkeleton />;
    }
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <CustomButton
              color="inherit"
              size="small"
              onClick={() => {
                setError(null);
                setStep("MODEL_SELECTION"); // Use string literal
              }}
            >
              TRY AGAIN
            </CustomButton>
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
          >
            <Step1_RepoInput onUrlSubmit={handleRepoSubmit} />
          </motion.div>
        );
      }
       case 'MODEL_SELECTION': // This step now renders the settings component
        return (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Step2_AiSettings
              repoUrl={url}
              onAnalyze={handleAnalyze}
              onBack={() => setStep('INPUT')}
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
            >
              <AnalysisDisplay
                model={model}
                repoName={url}
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
    <main className="min-h-full w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg min-h-[400px]">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </main>
  );
};

export default Analyzer;
