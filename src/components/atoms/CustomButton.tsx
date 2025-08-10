import React, { useState } from "react";
import {
  Button as MUIButton,
  type ButtonProps as MUIButtonProps,
} from "@mui/material";
import clsx from "clsx";
import Typography from "./Typography";

export interface CustomButtonProps extends MUIButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  theme?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  typographyProps?: React.ComponentProps<typeof Typography>;
  code?: boolean; // Whether to apply code font style
}

// The original base classes are preserved.
const baseClasses =
  "px-4 py-2 rounded-2xl font-semibold transition-colors duration-0 rounded-lg";

// --- MODIFIED FOR RESPONSIVENESS ---
// Padding is now smaller on mobile and expands on medium screens (md) and up.
const paddingClasses = {
  small: 'px-3 py-1.5', // Small buttons are often fine as is.
  medium: 'px-3 py-1.5 md:px-4 md:py-2', // Starts smaller, grows to original medium size.
  large: 'px-4 py-2 md:px-6 md:py-3',    // Starts as medium, grows to original large size.
};

// Font sizes are also adjusted for a better mobile reading experience.
const fontClasses = {
  small: 'text-xs', // Stays the same.
  medium: 'text-xs md:text-sm', // Smaller on mobile.
  large: 'text-sm md:text-base', // Smaller on mobile.
};
// --- END OF MODIFICATIONS ---

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
    // The original hover state logic is preserved.
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const secondaryClass =
      theme === "secondary" ? (isHovered ? "" : "bg-secondary") : "";

    // The original class composition logic is preserved.
    const primaryClasses = clsx(
      baseClasses,
      paddingClasses[size], // Using the new responsive classes.
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
          // The original Typography class logic is preserved to maintain text color behavior.
          <Typography
            code={code}
            className={clsx(
              "font-normal cursor-pointer",
              fontClasses[size], // Using the new responsive font sizes.
              !isHovered && theme === "secondary" ? "text-text-invert" : "",
              isHovered && theme === "secondary" ? "text-text-primary dark:text-text-primary-light" : "",
              theme === "primary" ? "text-text-primary dark:text-text-primary-light" : "",
              typographyProps?.className
            )}
          >
            {children}
          </Typography>
        )}
      </MUIButton>
    );
  }
);