import { Chip } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import Typography from "./Typography";
import { motion, AnimatePresence } from "framer-motion"; // <-- 1. IMPORT Framer Motion

// Define the AgentMode type for props
type AgentMode = "fast" | "smart";

// Update the props interface
interface SmartModeChipProps {
  mode: AgentMode;
  onChange: (newMode: AgentMode) => void;
}

// Define the descriptions for each mode
const modeDescriptions = {
  smart: "Smarter, for architectural questions.",
  fast: "Faster, for quick, specific questions.",
};

// Animation for the description text
const textAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: { duration: 0.2 },
};

export const SmartModeChip = ({ mode, onChange }: SmartModeChipProps) => {
  const handleClick = () => {
    const newMode = mode === "smart" ? "fast" : "smart";
    onChange(newMode);
  };

  const isEnabled = mode === "smart";

  const glowingIcon = (
    <LightbulbIcon
      sx={{
        "&.MuiChip-icon": {
          color: "var(--color-warning) !important",
          width: "18px",
        },
        color: "var(--color-warning)",
        filter: "drop-shadow(0 0 5px var(--color-warning))",
      }}
    />
  );

  const offIcon = (
    <LightbulbOutlinedIcon
      sx={{
        "&.MuiChip-icon": { width: "18px" },
      }}
    />
  );

  return (
    // --- 2. WRAP THE COMPONENT IN A FRAGMENT OR DIV ---
    // This allows us to have the Chip and the description as siblings.
    <div className="flex flex-col items-center gap-1">
      <Chip
        className="flex items-center justify-center w-[120px]" // Use a fixed width for stability
        icon={isEnabled ? glowingIcon : offIcon}
        label={
          <Typography
            variant="body2"
            className={`flex items-center justify-center cursor-pointer font-code md:text-[11px] text-[10px] ${
              isEnabled ? "font-semibold" : "font-normal"
            }`}
          >
            Think Deeper
          </Typography>
        }
        onClick={handleClick}
        variant="outlined"
        sx={{
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          backgroundColor: "var(--color-bg-paper)",
          color: "var(--color-text-secondary)",
          borderColor: "var(--color-border)",
          py: 2, // Adjusted padding for better look

          ...(isEnabled && {
            borderColor: "var(--color-primary)",
            // Use primary tint for consistency when selected
            backgroundColor: "rgba(var(--color-primary-rgb), 0.05)",
          }),

          "&:hover": {
            borderColor: "var(--color-primary)",
            backgroundColor: "var(--color-bg-hover)",
          },
        }}
      />
      {/* --- 3. ADD THE ANIMATED DESCRIPTION AREA --- */}
      <div className="min-h-[30px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={mode} {...textAnimation}>
            <Typography variant="caption" className="text-text-secondary">
              {modeDescriptions[mode]}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
