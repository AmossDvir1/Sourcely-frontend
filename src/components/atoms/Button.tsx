import React from "react";
import {
  Button as MUIButton,
  type ButtonProps as MUIButtonProps,
} from "@mui/material";
import clsx from "clsx";

// --- PROPS AND BASE CLASSES ---
export interface ButtonProps extends Omit<MUIButtonProps, "size"> {
  children: React.ReactNode;
  loading?: boolean;
  theme?: "primary" | "secondary";
  // STEP 1: Add "responsive" as a valid size option.
  size?: "small" | "medium" | "large" | "responsive";
  code?: boolean;
}

const baseClasses =
  "group px-4 py-2 rounded-lg ring-2 transition-all duration-200 ease-in-out focus-visible:outline-none";

// STEP 2: Update class objects to include a "responsive" definition.
const paddingClasses = {
  // Static sizes for explicit control
  small: "px-3 py-1.5",
  medium: "px-4 py-2",
  large: "px-6 py-3",
  // The new default: small on mobile, medium on larger screens.
  responsive: "px-0 py-0 sm:px-3 sm:py-1.5 md:px-3 md:py-2",
};

const fontClasses = {
  // Static font sizes
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
  // The new default: scales from smaller to base text size.
  responsive: "text-xs sm:text-sm md:text-base",
};

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      disabled = false,
      loading = false,
      className,
      // STEP 3: Set "responsive" as the default size.
      size = "responsive",
      code = true,
      theme = "primary",
      ...muiProps
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const textStyleClasses = clsx(
      // The lookup now works for "responsive" just like any other size.
      fontClasses[size],
      'font-normal',
      {
        'font-code': code,
        'font-sans': !code,
      }
    );

    const buttonThemeClasses = clsx({
      'active:scale-[.97]': true,
      'focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-paper': true,
      'bg-primary text-on-primary ring-primary': theme === 'primary',
      'hover:bg-transparent hover:text-primary': theme === 'primary',
      'dark:bg-transparent dark:text-primary': theme === 'primary',
      'dark:hover:bg-primary dark:hover:text-on-primary': theme === 'primary',
      'bg-secondary text-on-secondary ring-secondary': theme === 'secondary',
      'hover:bg-transparent hover:text-secondary': theme === 'secondary',
      'dark:bg-transparent dark:text-secondary': theme === 'secondary',
      'dark:hover:bg-secondary dark:hover:text-on-secondary': theme === 'secondary',
    });

    const finalButtonClasses = clsx(
      baseClasses,
      // The lookup for padding also works seamlessly.
      paddingClasses[size],
      textStyleClasses,
      buttonThemeClasses,
      isDisabled && "opacity-50 cursor-not-allowed"
    );

    return (
      <MUIButton
        disableRipple
        ref={ref}
        disabled={isDisabled}
        className={clsx(finalButtonClasses, className)}
        {...muiProps}
      >
        {loading ? "Loading..." : children}
      </MUIButton>
    );
  }
);

export default Button;