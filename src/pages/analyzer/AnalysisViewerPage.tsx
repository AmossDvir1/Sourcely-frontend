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
  const location = useLocation(); // Get location object to access state

  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(
    location.state?.analysis || null
  );
  const [codebase, setCodebase] = useState<string | null>(
    location.state?.codebase || null
  );
  const [isLoading, setIsLoading] = useState(!analysis || !codebase); // Only load if analysis is not pre-loaded
  const [error, setError] = useState<string | null>(null);
  const [showCodebase, setShowCodebase] = useState(false);
  // Determine if the analysis is already saved by checking for a user_id.
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (analysis) {
      setIsSaved(!!analysis.user_id);
    }
    // This effect now runs if the analysis OR the codebase is missing (e.g., on refresh)
    if ((!analysis || !codebase) && analysisId) {
      const fetchMissingData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch the analysis content (which doesn't have the code)
          const analysisRes = await analysisService.getAnalysisById(analysisId);
          setAnalysis(analysisRes.data);
          setIsSaved(!!analysisRes.data.user_id);
          // If the code is missing, re-fetch it using the repo URL from the analysis data
          if (!codebase) {
            const codeRes = await analysisService.getRepoData(
              analysisRes.data.repository
            );
            setCodebase(codeRes.data.codebase);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        } catch (err: any) {
          setError(
            "Could not load the analysis. It may have expired or the link is invalid."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchMissingData();
    }
  }, [analysisId, analysis, codebase]);

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

  const handleToggleCodebase = () => {
    setShowCodebase((prev) => !prev);
  };

  const handleReset = () => {
    navigate("/"); // Go back to the homepage to start a new analysis
  };

  const handleDelete = async () => {
    if (!analysisId) return;
    try {
      await analysisService.deleteAnalysis(analysisId);
      setIsSaved(false); // Update state on success
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      // Optional: show an error toast to the user
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

  if (!analysis || codebase === null || !codebase) {
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
