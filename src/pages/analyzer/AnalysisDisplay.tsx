import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Paper, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { SaveAnalysisDialog, type AnalysisSaveData } from './SaveAnalysisDialog';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import RegisterToSaveDialog from '../RegisterToSaveDialog';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AnalysisDisplayProps {
  analysis: string;
  onReset: () => void;
  repoName: string;
  repoUrl: string;
  onSave: (data: AnalysisSaveData) => Promise<void>;
  model: string;
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, repoName, onReset, onSave, model }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Get current location

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false); // State for new dialog
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSaveClick = () => {
    if (isAuthenticated) {
      setIsSaveDialogOpen(true);
    } else {
      setIsRegisterDialogOpen(true);
    }
  };

  return (
    <>
      <SaveAnalysisDialog
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={onSave}
        repoName={repoName}
        analysisContent={analysis}
        modelUsed={model}
      />
      <RegisterToSaveDialog
        open={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        analysisUrl={location.pathname} // Pass the current URL
      />

      <div className="w-full animate-fade-in">
        <Paper
          elevation={5}
          className="bg-gray-900/70 dark:bg-gray-950/80 backdrop-blur-md border border-[var(--color-border-glass)] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-700/50">
            <Typography code className="!font-mono text-sm text-gray-400">
              AI Analysis Result
            </Typography>
            <Tooltip title={copyStatus === 'copied' ? 'Copied!' : 'Copy to Clipboard'}>
              <IconButton onClick={handleCopy} size="small">
                {copyStatus === 'copied' ? (
                  <CheckIcon sx={{ color: 'var(--color-success)' }} fontSize="small" />
                ) : (
                  <ContentCopyIcon className="text-gray-400 hover:text-primary" fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div className="p-4 sm:p-6 max-h-[50vh] md:max-h-[60vh] overflow-y-auto custom-scrollbar">
            <article className="prose prose-invert max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </article>
          </div>
        </Paper>

        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button color="primary" onClick={onReset} className="w-full sm:w-auto">
            Analyze Another Repository
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveClick} // Use the new handler
            className="w-full sm:w-auto"
          >
            Save to My Analyses
          </Button>
        </div>
      </div>
    </>
  );
};

export default AnalysisDisplay;
