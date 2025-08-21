import {
  ToggleButtonGroup,
  ToggleButton,
  type SxProps,
  type Theme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "./atoms/Typography";
import React from "react";

export type ModeOption = {
  value: string;
  label: string;
  description: string;
  theme: "primary" | "secondary";
  icon?: React.ReactNode;
};

interface ModeSwitcherProps {
  label: string;
  value: string;
  options: [ModeOption, ModeOption];
  onChange: (newValue: string) => void;
}

const textAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: { duration: 0.2 },
};

// This helper generates the styles for each individual button
const getButtonStyles = (theme: "primary" | "secondary"): SxProps<Theme> => ({
  // The color is always subtle by default
  color: "var(--color-text-secondary)",

  // Apply the theme color ONLY when selected
  "&.Mui-selected": {
    color: `var(--color-${theme})`,
    // Use a very subtle background tint instead of a solid color
    backgroundColor: `rgba(var(--color-${theme}-rgb), 0.1)`,
    "&:hover": {
      backgroundColor: `rgba(var(--color-${theme}-rgb), 0.15)`,
    },
  },

  // Subtle hover for unselected buttons
  "&:hover": {
    backgroundColor: "var(--color-bg-hover)",
  },
});

export const ModeSwitcher = ({
  label,
  value,
  options,
  onChange,
}: ModeSwitcherProps) => {
  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: string | null
  ) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-sm">
      <Typography variant="body2" className="text-text-secondary font-medium">
        {label}
      </Typography>

      <ToggleButtonGroup
        className="w-[300px] cursor-pointer"
        value={value}
        exclusive
        onChange={handleModeChange}
        aria-label={label}
        fullWidth
        // --- THIS SX PROP IS THE KEY TO THE NEW DESIGN ---
        sx={{
          // 1. Give the entire group the capsule shape

          // 2. Target the individual buttons inside
          "& .MuiToggleButton-root": {
            flex: 1,
            textTransform: "none",
            fontFamily: "var(--font-code)",
            paddingY: { xs: "0.15rem", lg: "0.1rem" },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.5, sm: 1 },

            // 3. Set the default border color for all buttons
            borderColor: "var(--color-border)",

            // 4. Handle the border-collapse issue
            // For any button that is NOT the first one, apply a negative margin to overlap the border
            "&:not(:first-of-type)": {
              marginLeft: "-1px",
            },
          },
        }}
      >
        {options.map((option) => (
          <ToggleButton
            className="cursor-pointer"
            disableRipple
            key={option.value}
            value={option.value}
            aria-label={option.label}
            // 5. Apply the dynamic COLOR styles here
            sx={{ ...getButtonStyles(option.theme), borderRadius: "180px" }}
          >
            {option.icon}
            <span>{option.label}</span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <div className="min-h-[20px] flex items-center justify-center text-center px-2">
        <AnimatePresence mode="wait">
          <motion.div key={value} {...textAnimation}>
            <Typography variant="caption" className="text-text-secondary">
              {selectedOption.description}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
