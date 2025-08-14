import { useNavigate } from 'react-router-dom';
import Dialog from '../components/Dialog';
import { DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import Button from '../components/atoms/Button';

interface RegisterToSaveDialogProps {
  open: boolean;
  onClose: () => void;
  analysisUrl: string; // The URL of the current analysis page
}

const RegisterToSaveDialog = ({ open, onClose, analysisUrl }: RegisterToSaveDialogProps) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Navigate to register page with a redirect query parameter
    navigate(`/register?redirect=${encodeURIComponent(analysisUrl)}`);
  };

  const handleLogin = () => {
    // Navigate to login page with a redirect query parameter
    navigate(`/login?redirect=${encodeURIComponent(analysisUrl)}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Save Your Analysis</DialogTitle>
      <DialogContent>
        <Typography>
          Create an account or sign in to save this analysis to your profile.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button onClick={handleRegister} fullWidth theme="primary">
          Register
        </Button>
        <Button onClick={handleLogin} fullWidth theme="secondary">
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterToSaveDialog;
