// src/components/atoms/CustomDialog.tsx

import React from "react";
import { Dialog as MuiDialog, type DialogProps as MuiDialogProps } from "@mui/material";
import clsx from "clsx";

// Create a type alias for the props for clean code
export type CustomDialogProps = MuiDialogProps;

const Dialog = React.forwardRef<
  HTMLDivElement,
  CustomDialogProps
>((props, ref) => {
  // Destructure children and className to handle them explicitly
  const { children, className, ...rest } = props;

  return (
    <MuiDialog
 ref={ref}
      // --- SLOTPROPS FOR THEME STYLING ---

      slotProps={{
        // Target the backdrop (the layer behind the dialog)
        backdrop: {
          className: clsx(
            // --- Replicating the UserSettings Menu's Glass Effect Here ---
            "bg-[var(--color-bg-glass)]/30", // The very transparent background
            "backdrop-blur-[6px]", // The subtle blur effect for the page behind
          ),
        },
        // Target the main dialog panel (the "paper" element)
        paper: {
          className: clsx(
            // To ensure readability against the new glass backdrop,
            // we will make the dialog panel a solid, opaque card.
            "shadow-none", // Remove MUI's default elevation
            "bg-bg-paper-light/90", // Use our standard solid card background
            // "ring-1 ring-border", // A crisp, standard border
            "rounded-2xl", // Modern rounded corners
            "outline outline-2 outline-primary/50",

            className // Allow passing external classes
          ),
        },
      }}
      {...rest}
    >
      {children}
    </MuiDialog>
  );
});

export default Dialog;