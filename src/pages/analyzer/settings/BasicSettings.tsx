import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import Typography from "../../../components/atoms/Typography";
import { TitledChipGroup } from "../../../components/TitledChipGroup";

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
  contentTypes,
}: BasicSettingsProps) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        className="bg-bg-paper-light min-h-0"
        sx={{ pointerEvents: "none", margin: 0 }}
      >
        <Typography className="text-base font-medium md:text-xl">
          Basic Settings
        </Typography>
      </AccordionSummary>
      <Divider></Divider>
      <AccordionDetails className="bg-bg-paper-light">
        {/* The old ToggleButtonGroup is replaced with our new, clean component */}
        <TitledChipGroup
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
