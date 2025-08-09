import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { CustomButton as Button } from "../../../components/atoms/CustomButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "../../../components/atoms/Typography";
import type { AiModel } from "../../../api/analysisService";
import FileMasking from "./FileMasking";
import ModelSelection from "./ModelSelection";

type AdvancedSettingsProps = {
  models: AiModel[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  availableExtensions: string[];
  includedExtensions: Set<string>;
  onExtensionChange: (extension: string) => void;
  onSelectAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AdvancedSettings = (props: AdvancedSettingsProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="flex justify-between items-center w-full px-2">
          <Typography variant="h6">Advanced Settings</Typography>
          {props?.selectedModel && <Button disabled theme="secondary" size="small">{props.selectedModel}</Button>}
        </div>
      </AccordionSummary>
      <AccordionDetails className="space-y-6">
        <ModelSelection
          models={props.models}
          selectedModel={props.selectedModel}
          onSelect={props.onSelectModel}
        />
        <Divider />
        <FileMasking
          availableExtensions={props.availableExtensions}
          includedExtensions={props.includedExtensions}
          onExtensionChange={props.onExtensionChange}
          onSelectAllChange={props.onSelectAllChange}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedSettings;
