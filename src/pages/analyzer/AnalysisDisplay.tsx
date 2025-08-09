import ReactMarkdown from 'react-markdown';
import { Paper, Typography, Button } from '@mui/material';

type Props = {
  analysis: string;
  onReset: () => void;
};

export const AnalysisDisplay = ({ analysis, onReset }: Props) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <Paper elevation={3} className="p-6 sm:p-8 bg-gray-900/50">
        <Typography variant="h4" component="h2" className="!font-bold !mb-6 border-b border-gray-700 pb-4">
          🤖 AI Analysis Complete
        </Typography>
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </article>
      </Paper>
      <div className="mt-8 text-center">
        <Button variant="outlined" color="primary" onClick={onReset}>
          Analyze Another Repository
        </Button>
      </div>
    </div>
  );
};