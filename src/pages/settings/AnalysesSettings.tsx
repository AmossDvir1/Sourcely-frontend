import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CustomButton as Button } from '../../components/atoms/CustomButton';
import RepoCard from '../../components/RepoCard';
import Typography from '../../components/atoms/Typography';
import { useNavigate } from 'react-router-dom';
import * as analysisService from '../../api/analysisService';
import type { SavedAnalysis } from '../../api/analysisService';
import { Alert, CircularProgress } from '@mui/material';

// Mock data - replace with an API call
const mockRepos = [
  { id: 1, name: 'google/gemini-api', status: 'Completed', lastAnalyzed: '2025-08-01' },
  { id: 2, name: 'facebook/react', status: 'Completed', lastAnalyzed: '2025-07-28' },
  { id: 3, name: 'my-org/internal-project', status: 'Failed', lastAnalyzed: '2025-07-25' },
];


const AnalysesSettings = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  // ✅ 3. FETCH DATA WHEN THE COMPONENT MOUNTS
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await analysisService.getUserAnalyses();
        setAnalyses(response.data);
      } catch (err) {
        setError("Failed to load your analyses. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []); // The empty dependency array means this runs once on mount.

   // ✅ 4. RENDER DIFFERENT UI FOR EACH STATE
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Empty State (no saved analyses)
  if (analyses.length === 0) {
    return (
      <div className="text-center py-16 px-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <Typography variant="h5" className="font-semibold mb-2">No Analyses Saved</Typography>
        <Typography className="text-gray-500 dark:text-gray-400 mb-6">
          Analyze a repository and save it to see your list here.
        </Typography>
        <Button theme="secondary" onClick={() => navigate('/')}>
          Analyze a Repository
        </Button>
      </div>
    );
  }

  // Success State (show the list)
  return (
    <motion.div
      key="analyses"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
        <div>
            <Typography variant="h5" className="font-semibold mb-1">My Analyses</Typography>
            <Typography variant="body2" className="text-gray-500">
              Here are all the analyses you've saved.
            </Typography>
        </div>
        <div className="space-y-4">
            {/* Update RepoCard to expect the new data shape */}
            {analyses.map(analysis => (
                <RepoCard key={analysis.id} analysis={analysis} />
            ))}
        </div>
    </motion.div>
  );
}

export default AnalysesSettings;