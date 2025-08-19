import React from "react";
import { styled, SwipeableDrawer, Box } from "@mui/material";

// The Puller is styled using our new CSS variable.
// It will now change color automatically with the theme.
const Puller = styled("div")(() => ({
  width: 30,
  height: 6,
  backgroundColor: "var(--color-puller-bg)",
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

interface SwipeableMobileDrawerProps {
  open: boolean;
  toggleDrawer: (event: React.SyntheticEvent) => void;
  children: React.ReactNode; // Using `children` is more flexible
}

const SwipeableMobileDrawer: React.FC<SwipeableMobileDrawerProps> = ({
  open,
  toggleDrawer,
  children,
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        zIndex: 1500, // A high z-index to appear above other content
        "& .MuiPaper-root": {
          // Use theme variables for the background
          backgroundColor: "var(--color-bg-paper)",
          // Let content define height, but with a max limit
          height: "max-content",
          maxHeight: "80vh",
          // More consistent padding using theme units
          py: 3,
          px: 2,
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          // `visible` is needed to see the puller, which is positioned absolutely
          overflow: "visible",
        },
      }}
    >
      <Puller />

      {/* 
        This Box component creates a clean flex layout for the content.
        The `gap` property is a modern way to space children, replacing the
        manual margin calculation from the original code.
      */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2, // Adds space between each child element
          width: "100%",
          mt: 2, // Margin-top to provide space for the puller
        }}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

export default SwipeableMobileDrawer;