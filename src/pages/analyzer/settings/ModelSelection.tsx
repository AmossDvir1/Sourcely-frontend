import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import clsx from "clsx";

import Typography from "../../../components/atoms/Typography";
import type { AiModel } from "../../../api/analysisService";
import VirtualTable from "../../../components/VirtualTable";

type ModelSelectionProps = {
  models: AiModel[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
  height: number;
};

const ModelSelection = ({
  models,
  selectedModel,
  onSelect,
  height,
}: ModelSelectionProps) => {
  const renderModelRow = ({
    item,
    style,
    isSelected,
    onClick,
  }: {
    item: AiModel;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    // ✅ 2. WRAP THE CONTENT IN ListItem and ListItemButton
    // The outer `ListItem` is now just for positioning and structure.
    <ListItem
      key={item.id}
      style={style}
      className="outline-1  outline-[rgba(var(--color-primary-rgb),0.3)]"
      component="div" // Render as a div instead of li for structure
      disablePadding // We disable padding because ListItemButton has its own
    >
      {/* The `ListItemButton` is the interactive element now. */}
      {/* It receives the styling (`className`) and the `onClick` handler. */}
      <ListItemButton
        onClick={onClick}
        selected={isSelected} // Use the `selected` prop for state
        className={clsx(
          "flex justify-between items-center w-full h-full",
          "transition-colors duration-200 dark:bg-bg-default/30 bg-bg-default/80",
          !isSelected ? "hover:bg-[rgba(var(--color-primary-rgb),0.05)]" : ""
        )}
        // ✅ 3. (Optional but Recommended) USE SX FOR MUI-SPECIFIC STATES
        // This is the cleanest way to style the `selected` state.
        sx={{
          "&.Mui-selected": {
            backgroundColor: "rgba(var(--color-primary-rgb),0.1)",
            "&:hover": {
              backgroundColor: "rgba(var(--color-primary-rgb),0.15)",
            },
          },
        }}
      >
        <ListItemText
          primary={
            <Typography className="!font-semibold text-sm md:text-base">
              {item.name}
            </Typography>
          }
          secondary={
            <Typography variant="caption" className="text-xs">
              {item.description}
            </Typography>
          }
        />
        {isSelected && (
          <CheckCircleIcon className="text-primary" sx={{ ml: 2 }} />
        )}
      </ListItemButton>
    </ListItem>
  );

  return (
    <div>
      <Typography className="text-sm md:text-lg" gutterBottom>Model Selection</Typography>
      <VirtualTable
        items={models}
        rowHeight={140} // We've decided each row will be 70px tall
        height={height} // The scrollable container will be 350px tall
        selectedId={selectedModel}
        onRowClick={(item) => onSelect(item.id)}
        renderRow={renderModelRow} // Pass our custom row renderer
      />
    </div>
  );
};

export default ModelSelection;
