import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { CustomButton as Button } from "./atoms/CustomButton";

export default function UserSettings() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleMenu}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <SettingsIcon className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose} // Closes menu on item click
        slotProps={{
          paper: {
            elevation: 0,
            // Most styles are now converted to Tailwind classes for responsiveness and consistency.
            className:
              "flex flex-col items-center justify-center rounded-xl overflow-visible " +
              "outline outline-1 outline-[var(--color-secondary)] " +
              "bg-[var(--color-bg-glass)]/25 backdrop-blur-sm " +
              "border border-[var(--color-border-glass)] shadow-[0_4px_15px_rgba(0,0,0,0.15)] " +
              "p-5 sm:p-6 md:p-8", // Responsive padding
            sx: {
              // The sx prop is still useful for things Tailwind can't easily handle,
              // like child component selectors or simple margin-top.
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
          list: {
            // List styling is also cleaner in className.
            className: "flex flex-col items-center justify-center p-0 m-0 w-full",
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <MenuItem
          // Added w-full to the button component via its parent.
          // Adjusted vertical margin for a better fit on mobile.
          className="flex items-center justify-center w-full my-1.5 sm:my-2"
          component={Button}
          size="small"
          onClick={() => navigate("/settings/profile")}
        >
          Profile
        </MenuItem>
        <MenuItem
          className="flex items-center justify-center w-full my-1.5 sm:my-2"
          component={Button}
          size="small"
          onClick={() => navigate("/settings/repositories")}
        >
          My Analyses
        </MenuItem>
      </Menu>
    </>
  );
}