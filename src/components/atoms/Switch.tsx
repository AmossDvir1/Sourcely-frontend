import * as React from "react";
import { Switch as MuiSwitch, type SwitchProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import Typography from "./Typography";

/**
 * ThemedSwitch – responsive MUI v7 Switch styled with CSS variables
 */
const ThemedSwitch = styled((props: SwitchProps) => (
  <MuiSwitch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "var(--color-on-primary)",
      "& + .MuiSwitch-track": {
        backgroundColor: "var(--color-primary)",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "var(--color-primary-hover)",
      border: "4px solid var(--color-bg-paper)",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      backgroundColor: "var(--color-text-disabled)",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.4,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    backgroundColor: "var(--color-bg-default)",
    boxShadow: "var(--elevation-1)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "var(--color-border-light)",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },

  // 📱 Mobile adjustments
  [theme.breakpoints.down("sm")]: {
    width: 36,
    height: 22,
    "& .MuiSwitch-thumb": {
      width: 18,
      height: 18,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(14px)",
    },
  },
}));

export interface CustomSwitchProps extends SwitchProps {
  label?: string;
}

export const Switch: React.FC<CustomSwitchProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <label
      className={clsx(
        "flex items-center gap-2 cursor-pointer select-none flex-wrap", // wrap on tight screens
        className
      )}
    >
      <ThemedSwitch {...props} />
      {label && (
        <Typography
        code
        tracking={false}
          className={
            "text-[12px] sm:text-sm" // smaller on mobile, bigger on desktop
          }
        >
          {label}
        </Typography>
      )}
    </label>
  );
};
