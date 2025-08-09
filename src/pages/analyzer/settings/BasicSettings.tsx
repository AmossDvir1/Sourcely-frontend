import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Typography from "../../../components/atoms/Typography";

type BasicSettingsProps = {
  selectedTypes: string[]; // Expects an array of strings
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string[]
  ) => void;
};

export const BasicSettings = ({
  selectedTypes,
  onChange,
}: BasicSettingsProps) => {
const isAllSelected = selectedTypes.includes('All');

 return (
    <Accordion defaultExpanded>
      <AccordionSummary sx={{ pointerEvents: 'none' }}>
        <Typography variant="h6">Basic Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography gutterBottom>Generated Content</Typography>
        <ToggleButtonGroup
          value={selectedTypes} // Pass the array directly
          onChange={onChange}    // Pass the handler directly
          color="primary"
          aria-label="generated content type"
        >
          {/* The disabled logic remains the same */}
          <ToggleButton disableRipple value="All" disabled={isAllSelected}>
            All
          </ToggleButton>
          <ToggleButton disableRipple value="General Description">Description</ToggleButton>
          <ToggleButton disableRipple value="instructions-file">Instructions</ToggleButton>
          <ToggleButton disableRipple value="Project File Tree">File Tree</ToggleButton>
        </ToggleButtonGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicSettings;
