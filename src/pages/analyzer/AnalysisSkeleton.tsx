import { Skeleton, Paper } from '@mui/material';

export const AnalysisSkeleton:React.FC = () => (
  <Paper elevation={3} className="p-6 sm:p-8 bg-gray-900/50 w-full max-w-4xl">
    <Skeleton variant="text" width="60%" height={40} sx={{ mb: 4 }} />
    <Skeleton variant="rectangular" height={20} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={20} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="80%" height={20} />
  </Paper>
);
