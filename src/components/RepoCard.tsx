import { motion } from 'framer-motion';
import { IconButton, Chip, Tooltip } from '@mui/material'; // <-- Import Tooltip
import { Visibility, Sync, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import Typography from './atoms/Typography';
import type { SavedAnalysis } from '../api/analysisService';
import { useNavigate } from 'react-router-dom'; // <-- STEP 1: Import useNavigate

const RepoCard = ({ analysis }: { analysis: SavedAnalysis }) => {
  const navigate = useNavigate(); // <-- STEP 2: Initialize the navigate function

  // STEP 3: Create the handler function
  const handleViewAnalysis = () => {
    // Navigate to the viewer page using the analysis ID
    // We pass the 'analysis' object in the state to prevent re-fetching data
    navigate(`/analysis/view/${analysis._id}`, { state: { analysis } });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-border rounded-lg bg-bg-paper hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col overflow-hidden"> {/* Added overflow-hidden */}
        <Typography variant="h6" className="font-semibold text-primary truncate">{analysis.name}</Typography>
        <Typography variant="caption" className="text-text-secondary italic mt-1 break-all">{analysis.repository}</Typography>
        <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-4 mt-2">
            <Chip
                label={`Model: ${analysis.modelUsed}`}
                size="small"
                variant="outlined"
            />
            <Typography variant="caption" className="text-text-secondary">
                Saved on: {format(new Date(analysis.analysisDate), 'MMM d, yyyy')}
            </Typography>
        </div>
      </div>
      <div className="flex items-center self-end sm:self-center space-x-1 flex-shrink-0"> {/* Added flex-shrink-0 */}
        {/* STEP 4: Attach the handler to the button's onClick event */}
        <Tooltip title="View Analysis">
          <IconButton onClick={handleViewAnalysis} color="primary">
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Re-analyze">
          <IconButton color="secondary">
            <Sync />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    </motion.div>
  );
}

export default RepoCard;