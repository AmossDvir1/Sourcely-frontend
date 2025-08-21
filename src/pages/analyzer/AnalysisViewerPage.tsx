import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as analysisService from "../../api/analysisService";
import type { SavedAnalysis } from "../../api/analysisService";
import AnalysisDisplay from "./AnalysisDisplay";
import GlowingSpinner from "../../components/atoms/GlowingSpinner";
import { Alert } from "@mui/material";
import type { AnalysisSaveData } from "./SaveAnalysisDialog";

const AnalysisViewerPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // State initialization is correct and remains the same
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(
    location.state?.analysis || null
  );
  const [codebase, setCodebase] = useState<string | null>(null); // Start with null
  const [isLoading, setIsLoading] = useState(true); // Start loading
  const [error, setError] = useState<string | null>(null);
  const [showCodebase, setShowCodebase] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // This flag prevents state updates if the component unmounts during a fetch
    let isCancelled = false;

    const fetchMissingData = async () => {
      // Use a local variable to track the analysis data we have or will get.
      let currentAnalysis = analysis;

      try {
        // STEP 1: Fetch the core analysis object ONLY if it's missing.
        // This is the key change that breaks the loop.
        if (!currentAnalysis && analysisId) {
          console.log("Analysis data is missing, fetching...");
          const analysisRes = await analysisService.getAnalysisById(analysisId);
          if (isCancelled) return;
          currentAnalysis = analysisRes.data;
          setAnalysis(currentAnalysis);
        }

        // STEP 2: Fetch the codebase ONLY if it's missing AND we have an analysis object.
        if (!codebase && currentAnalysis) {
          console.log("Codebase is missing, fetching...");
          const codeRes = await analysisService.getRepoData(currentAnalysis.repository);
          if (isCancelled) return;
          setCodebase(codeRes.data.codebase);
        }

        // After all fetches, update the 'isSaved' status
        if (currentAnalysis) {
          setIsSaved(!!currentAnalysis.user_id);
        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (err: any) {
        if (!isCancelled) {
          setError("Could not load the analysis. It may have expired or the link is invalid.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchMissingData();

    return () => {
      isCancelled = true;
    };
    // Keep dependencies, as we need the effect to run if any of these change.
    // The internal logic now correctly handles these changes without looping.
  }, [analysisId, analysis, codebase]);

  // The rest of the handlers are unchanged
  const handleSave = async (data: AnalysisSaveData) => {
    try {
      const dataToSave = { ...data, tempId: analysisId };
      const response = await analysisService.saveAnalysis(dataToSave);
      setIsSaved(true);
      if (analysisId !== response.data._id) {
        navigate(`/analysis/view/${response.data._id}`, { replace: true, state: { analysis: response.data, codebase } });
      }
    } catch (error) {
      console.error("Failed to save analysis:", error);
      throw error;
    }
  };

  const handleToggleCodebase = () => setShowCodebase((prev) => !prev);
  const handleReset = () => navigate("/");

  const handleDelete = async () => {
    if (!analysisId) return;
    try {
      await analysisService.deleteAnalysis(analysisId);
      setIsSaved(false);
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <GlowingSpinner />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analysis || codebase === null) {
    return <Alert severity="info">Analysis not found.</Alert>;
  }

  return (
    <AnalysisDisplay
      analysis={analysis.analysisContent}
      repoName={analysis.repository}
      repoUrl={analysis.repository}
      model={analysis.modelUsed}
      onSave={handleSave}
      onReset={handleReset}
      codebase={codebase}
      showCodebase={showCodebase}
      onToggleCodebase={handleToggleCodebase}
      isSaved={isSaved}
      onDelete={handleDelete}
    />
  );
};

export default AnalysisViewerPage;