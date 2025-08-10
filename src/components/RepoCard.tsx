import { motion } from 'framer-motion';
import { IconButton, Chip } from '@mui/material';
import { Visibility, Sync, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import Typography from './atoms/Typography';
import type { SavedAnalysis } from '../api/analysisService';


const RepoCard = ({ analysis }: { analysis: SavedAnalysis }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col">
        {/* Use the fields from the analysis object */}
        <Typography variant="h6" className="font-semibold text-primary">{analysis.name}</Typography>
        <Typography variant="caption" className="text-gray-500 italic mt-1 break-all">{analysis.repository}</Typography>
        <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-4 mt-2">
            <Chip
                label={`Model: ${analysis.modelUsed}`}
                size="small"
                variant="outlined"
            />
            <Typography variant="caption" className="text-gray-500">
                Saved on: {format(new Date(analysis.analysisDate), 'MMM d, yyyy')}
            </Typography>
        </div>
      </div>
      <div className="flex items-center self-end sm:self-center space-x-1">
        <IconButton title="View Analysis" color="primary">
          <Visibility />
        </IconButton>
        <IconButton title="Re-analyze" color="secondary">
          <Sync />
        </IconButton>
        <IconButton title="Delete" color="error">
          <Delete />
        </IconButton>
      </div>
    </motion.div>
  );
}

export default RepoCard;