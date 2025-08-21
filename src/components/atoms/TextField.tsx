import React from "react";
import {
  TextField as MuiTextField,
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import { useResponsive } from "../../hooks/useResponsive";

export type TextFieldProps = Omit<MuiTextFieldProps, "variant">;

const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const { isMobile } = useResponsive(); // Step 2: Use the hook

    return (
      <MuiTextField
        ref={ref}
        variant="outlined"
        className={className}
        sx={{
          "& input:-webkit-autofill": {
            // The "box-shadow hack" to paint over the browser's autofill color.
            // We use our theme's solid paper background color.
            // The `inset` keyword is crucial.
            boxShadow: `0 0 0 100px var(--color-bg-paper) inset !important`,

            // Override the text color that the browser forces.
            "-webkit-text-fill-color": "var(--color-text-primary) !important",
          },
          "& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
            {
              boxShadow: `0 0 0 100px var(--color-bg-paper) inset !important`,
              "-webkit-text-fill-color": "var(--color-text-primary) !important",
            },
          "& .MuiOutlinedInput-root": {
            fontFamily: "var(--font-code)",
            fontSize: isMobile ? "13px" : "16px",

            "& fieldset": {
              borderColor: "var(--color-border)",
              borderRadius: "25px",
            },
            "&:hover fieldset": { borderColor: "var(--color-primary)" },
            "&.Mui-focused fieldset": {
              borderColor: "var(--color-primary)",
              borderWidth: "2px",
            },
            color: "var(--color-text-primary)",
          },
          "& .MuiInputLabel-root": {
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-code)",
            fontSize: isMobile ? "13px" : "16px",
            fontWeight: 500,
            "&.Mui-focused": { color: "var(--color-primary)" },
          },
          "& .MuiFormHelperText-root": {
            color: rest?.error
              ? "var(--color-error)"
              : "var(--color-text-disabled)",
          },
        }}
        {...rest}
      />
    );
  }
);

export default TextField;
