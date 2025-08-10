import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "../../../components/atoms/Typography";
import { CustomButton as Button } from "../../../components/atoms/CustomButton";
import type { AiModel } from "../../../api/analysisService";
import ModelSelection from "./ModelSelection";
import { useResponsive } from "../../../hooks/useResponsive";
import { TitledToggleButtonGroup } from "../../../components/TitledToggleButtonGroup";

type AdvancedSettingsProps = {
  models: AiModel[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  availableExtensions: string[];
  selectedExtensions: string[];
  onExtensionChange: (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string[]
  ) => void;
};

export const AdvancedSettings = (props: AdvancedSettingsProps) => {
  const { isMobile } = useResponsive();
  const virtualTableHeight = isMobile ? 240 : 350;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between w-full px-2">
          <Typography variant="h6">Advanced Settings</Typography>
          <Button size="small" disabled theme="secondary">
            {props.models.find(model => model.id === props?.selectedModel)?.name}
          </Button>
        </div>
      </AccordionSummary>
      <AccordionDetails className="space-y-4 sm:space-y-6">
        <ModelSelection
          models={props.models}
          selectedModel={props.selectedModel}
          onSelect={props.onSelectModel}
          height={virtualTableHeight}
        />
        <Divider />
        {/* FileMasking is replaced with our new, clean component */}
        <TitledToggleButtonGroup
          title="File Masking (Filter by Extension)"
          ariaLabel="file type extensions"
          options={props.availableExtensions}
          selection={props.selectedExtensions}
          onChange={props.onExtensionChange}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedSettings;