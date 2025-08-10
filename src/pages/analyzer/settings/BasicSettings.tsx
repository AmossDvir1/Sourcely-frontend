import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Typography from "../../../components/atoms/Typography";
import { TitledToggleButtonGroup } from "../../../components/TitledToggleButtonGroup";

type BasicSettingsProps = {
  selectedTypes: string[];
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string[]
  ) => void;
  contentTypes: string[];
};

export const BasicSettings = ({
  selectedTypes,
  onChange,
  contentTypes
}: BasicSettingsProps) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary sx={{ pointerEvents: 'none' }}>
        <Typography variant="h6">Basic Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* The old ToggleButtonGroup is replaced with our new, clean component */}
        <TitledToggleButtonGroup
          title="Generated Content"
          ariaLabel="generated content type"
          options={contentTypes}
          selection={selectedTypes}
          onChange={onChange}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicSettings;