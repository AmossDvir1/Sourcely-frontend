import React, { useState } from "react";
import {
  Button as MUIButton,
  type ButtonProps as MUIButtonProps,
} from "@mui/material";
import clsx from "clsx";
import Typography from "./Typography";

// Extend MUI's ButtonProps
export interface CustomButtonProps extends MUIButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  theme?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  typographyProps?: React.ComponentProps<typeof Typography>;
  code?: boolean; // Whether to apply code font style
}

// Utility to merge Tailwind classes based on props
const baseClasses =
  "px-4 py-2 rounded-2xl font-semibold transition-colors duration-0 rounded-lg";


  const paddingClasses = {
  small: 'px-3 py-1.5',
  medium: 'px-4 py-2',
  large: 'px-6 py-3',
};

const fontClasses = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base',
};

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    {
      children,
      disabled = false,
      loading = false,
      className,
      typographyProps,
      size = 'medium', 
      code = true,
      theme = "primary",
      ...muiProps
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const secondaryClass =
      theme === "secondary" ? (isHovered ? "" : "bg-secondary") : "";

    const primaryClasses = clsx(
      baseClasses,
      paddingClasses[size], // Use the mapping here
      secondaryClass,
      `bg-primary hover:bg-bg-default-light outline-2 outline-secondary`,
      isDisabled && "opacity-50 cursor-not-allowed"
    );

    return (
      <MUIButton
        disableRipple
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={ref}
        disabled={isDisabled}
        className={clsx(primaryClasses, className)}
        {...muiProps}
      >
        {loading ? (
          "Loading..."
        ) : (
          <Typography
            code={code}
            className={clsx(
              "font-normal",
              fontClasses[size], // Use the mapping here
              !isHovered && theme === "secondary" ? "text-text-invert" : "",
              isHovered && theme === "secondary" ? "text-text-primary dark:text-text-primary-light" : "",
              theme === "primary" ? "text-text-primary dark:text-text-primary-light" : "",
              typographyProps?.className // Safely merge with any passed-in typography classes
            )}
          >
            {children}
          </Typography>
        )}
      </MUIButton>
    );
  }
);
