import { Box, Paper, FormControlLabel, Checkbox } from '@mui/material';
import Typography from '../../../components/atoms/Typography';
import ExtensionCube from './ExtensionCube';

type FileMaskingProps = {
  availableExtensions: string[];
  includedExtensions: Set<string>;
  onExtensionChange: (extension: string) => void;
  onSelectAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileMasking = ({
  availableExtensions,
  includedExtensions,
  onExtensionChange,
  onSelectAllChange,
}: FileMaskingProps) => {
  const isAllSelected = availableExtensions.length > 0 && includedExtensions.size === availableExtensions.length;

  return (
    <div>
      <Typography gutterBottom>File Masking</Typography>
      <FormControlLabel
        control={<Checkbox checked={isAllSelected} onChange={onSelectAllChange} />}
        label="All File Types"
      />
      <Paper variant="outlined" className="p-4 mt-1" sx={{ borderColor: 'var(--color-border)' }}>
        <Box className="flex flex-wrap gap-3">
          {availableExtensions.map(ext => (
            <ExtensionCube
              key={ext}
              extension={ext}
              isSelected={includedExtensions.has(ext)}
              isDisabled={isAllSelected}
              onClick={() => onExtensionChange(ext)}
            />
          ))}
        </Box>
      </Paper>
    </div>
  );
};

export default FileMasking;