import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as analysisService from '../../api/analysisService';
import type { SavedAnalysis } from '../../api/analysisService';
import AnalysisDisplay from './AnalysisDisplay';
import GlowingSpinner from '../../components/atoms/GlowingSpinner';
import { Alert } from '@mui/material';
import type { AnalysisSaveData } from './SaveAnalysisDialog';

const AnalysisViewerPage = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object to access state

  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(location.state?.analysis || null);
  const [isLoading, setIsLoading] = useState(!analysis); // Only load if analysis is not pre-loaded
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // This effect now only runs if the analysis data was NOT passed in the route state (i.e., on page refresh)
    if (!analysis && analysisId) {
      const fetchAnalysis = async () => {
        setIsLoading(true); // Ensure loader shows on refresh
        setError(null);
        try {
          const response = await analysisService.getAnalysisById(analysisId);
          setAnalysis(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        } catch (err: any) {
          setError("Could not load the analysis. It may have expired or the link is invalid.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnalysis();
    }
  }, [analysisId, analysis]); // Depend on 'analysis' to prevent re-fetching


  const handleSave = async (data: AnalysisSaveData) => {
    try {
      await analysisService.saveAnalysis(data);
      // Optional: Show a success message
      navigate('/settings/repositories'); // Redirect to their list of saved analyses
    } catch (error) {
      console.error("Failed to save analysis:", error);
      // Optional: Show an error message in the dialog
      throw error;
    }
  };

  const handleReset = () => {
    navigate('/'); // Go back to the homepage to start a new analysis
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><GlowingSpinner /></div>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analysis) {
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
    />
  );
};

export default AnalysisViewerPage; 
