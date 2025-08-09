import { Paper } from '@mui/material';
import Typography from '../../../components/atoms/Typography';

// Define the component's props for clarity and type safety
type ExtensionCubeProps = {
  extension: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

export const ExtensionCube = ({ extension, isSelected, isDisabled, onClick }: ExtensionCubeProps) => {
  return (
    <Paper
      variant="outlined"
      onClick={!isDisabled ? onClick : undefined} // Only allow clicks if not disabled
      sx={{
        width: 100,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        // --- Conditional Styling ---
        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
        backgroundColor: isSelected ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent',
        opacity: isDisabled && !isSelected ? 0.5 : 1,
        '&:hover': {
          borderColor: isDisabled ? undefined : 'var(--color-primary-hover)',
          transform: isDisabled ? undefined : 'scale(1.05)',
        }
      }}
    >
      <Typography code className="!font-semibold">{extension}</Typography>
    </Paper>
  );
};

// Default export is required for React's Fast Refresh feature
export default ExtensionCube;