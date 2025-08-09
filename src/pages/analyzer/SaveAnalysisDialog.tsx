import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';

import { CustomButton as Button } from '../../components/atoms/CustomButton';


// Define the shape of the data that will be saved
export interface AnalysisSaveData {
  name: string;
  description?: string;
  repository: string;
  analysisDate: string;
  model: string;
  analysisContent: string;
}

type SaveAnalysisDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: AnalysisSaveData) => Promise<void>;
  repoName: string;
  modelUsed: string; // e.g., "GPT-4",
  analysisContent: string;
};

export const SaveAnalysisDialog: React.FC<SaveAnalysisDialogProps> = ({ open, onClose, onSave, repoName, modelUsed, analysisContent }) => {
  // State for the editable form fields
  const [name, setName] = useState(repoName);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // This effect resets the form's state whenever the dialog is opened
  // with a new repository name.
  useEffect(() => {
    if (open) {
      setName(repoName);
      setDescription('');
      setIsSaving(false);
    }
  }, [open, repoName]);

  const handleSave = async () => {
    setIsSaving(true);
    const analysisDate = new Date().toISOString();

    const dataToSave: AnalysisSaveData = {
      name,
      description,
      repository: repoName,
      analysisDate,
      model: modelUsed,
      analysisContent
    };

    try {
      // Call the onSave function passed down from the parent
      await onSave(dataToSave);
      onClose(); // Close the dialog on successful save
    } catch (error) {
      console.error('Save failed:', error);
      // Optionally, show an error message inside the dialog
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Analysis</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add a name and description to save this analysis to your list.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Analysis Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description (Optional)"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="repository"
          label="Repository"
          type="text"
          fullWidth
          variant="outlined"
          value={repoName}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="date"
          label="Analysis Date"
          type="text"
          fullWidth
          variant="outlined"
          value={new Date().toLocaleDateString()}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="model"
          label="Model Used"
          type="text"
          fullWidth
          variant="outlined"
          value={modelUsed}
          disabled
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};