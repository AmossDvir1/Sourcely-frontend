import { useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import api from "../../api/axiosClient";
import { Step1_RepoInput } from "./Step1_RepoInput";
import { Step2_ModelSelection } from "./Step2_ModelSelection";
import { AnalysisDisplay } from "./AnalysisDisplay";
import { AnalysisSkeleton } from "./AnalysisSkeleton";
import { CustomButton } from "../../components/atoms/CustomButton";

// Enum for managing steps to make the code more readable
type AnalysisStep = 'INPUT' | 'MODEL_SELECTION' | 'RESULT';


const Analyzer: React.FC = () => {
  // State for the current step
  const [step, setStep] = useState<AnalysisStep>('INPUT');

  // State for data collected across steps
  const [url, setUrl] = useState("");
  const [model, setModel] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRepoSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
    setStep('MODEL_SELECTION');
  };

  const handleAnalyze = async (selectedModel: string) => {
    setModel(selectedModel);
    setIsLoading(true);
    setError(null);

    try {
      // IMPORTANT: Update your API call to send both the URL and the model
      const response = await api.post("/code/analyze", {
        githubUrl: url,
        modelId: selectedModel, // Send the selected model ID to the backend
      });
      setAnalysis(response.data.analysis);
setStep('RESULT'); 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        axios.isAxiosError(err) && err.response
          ? err.response.data?.error || "An unknown server error occurred."
          : "An unexpected error occurred. Please check the console.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
     setStep('INPUT');
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
            <CustomButton color="inherit" size="small" onClick={() => {
              setError(null);
              setStep('MODEL_SELECTION'); // Use string literal
            }}>
              TRY AGAIN
            </CustomButton>
          }
        >
          {error}
        </Alert>
      );
    }

    // --- CHANGE THIS ---
    // The switch statement now uses string literals for its cases
switch (step) {
      case 'INPUT': { // You can add braces to all cases for consistency
        return (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Step1_RepoInput onUrlSubmit={handleRepoSubmit} />
          </motion.div>
        );
      }
      case 'MODEL_SELECTION': {
        return (
          <motion.div key="model" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Step2_ModelSelection
              repoUrl={url}
              onAnalyze={handleAnalyze}
              onBack={() => setStep('INPUT')}
              isLoading={isLoading}
            />
          </motion.div>
        );
      }
      case 'RESULT': {
        // Even though this case has no declaration, adding braces is a good practice
        return (
          analysis && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AnalysisDisplay analysis={analysis} onReset={handleReset} />
            </motion.div>
          )
        );
      }
      
      // --- THE FIX IS HERE ---
      default: { // Add opening brace
        // This is excellent TypeScript practice for ensuring all cases are handled!
        // The declaration is now safely inside its own block scope.
        const _exhaustiveCheck: never = step;
        return <div>Something went wrong: {_exhaustiveCheck}</div>;
      } // Add closing brace
      // --- END FIX ---
    }
    // --- END CHANGE ---
  };

  return (
    <main className="min-h-full w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Analyzer;