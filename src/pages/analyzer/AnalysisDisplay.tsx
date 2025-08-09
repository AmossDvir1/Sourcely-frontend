import ReactMarkdown from 'react-markdown';
import { Paper, Typography } from '@mui/material';
import { SaveAnalysisDialog, type AnalysisSaveData } from './SaveAnalysisDialog';
import { CustomButton as Button } from '../../components/atoms/CustomButton';
import { useState } from 'react';

interface AnalysisDisplayProps {
  analysis: string;
  onReset: () => void;
  repoName: string;
  onSave: (data: AnalysisSaveData) => Promise<void>; 
  model:string;
};

export const AnalysisDisplay:React.FC<AnalysisDisplayProps> = ({ analysis, repoName, onReset, onSave, model }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
        <>
      {/* The Dialog component is rendered here but is invisible until open={true} */}
      <SaveAnalysisDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={onSave}
        repoName={repoName}
        analysisContent={analysis}
        modelUsed={model} // You can make this dynamic if needed
      />

      <div className="w-full max-w-4xl animate-fade-in">
        <Paper elevation={3} className="p-6 sm:p-8 bg-gray-900/50">
          <Typography variant="h4" component="h2" className="!font-bold !mb-6 border-b border-gray-700 pb-4">
            🤖 AI Analysis Complete
          </Typography>
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </article>
        </Paper>
        <div className="mt-8 text-center flex justify-center items-center space-x-4">
          <Button variant="outlined" color="primary" onClick={onReset}>
            Analyze Another Repository
          </Button>
          
          {/* ✅ 4. THIS BUTTON NOW OPENS THE DIALOG */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsDialogOpen(true)}
          >
            Save to My Analyses
          </Button>
        </div>
      </div>
    </>
  );
};