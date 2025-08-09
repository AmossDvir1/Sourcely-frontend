import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../hooks/useAuth"; // Assuming useAuth provides user info
import { CustomButton as Button } from "./atoms/CustomButton";

export default function UserSettings() {
//   const { user } = useAuth(); // Destructure user if you need it for the avatar
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
        {/* You can use a user avatar or a settings icon */}
        {/* For example, if user object has a name: */}
        {/* <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.charAt(0)}</Avatar> */}
        <SettingsIcon className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
      </IconButton>
      <Menu
        className="flex flex-col items-center justify-center bg-transparent"
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose} // Closes menu on item click
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              padding: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              overflow: "visible",
                outline: "1px solid var(--color-secondary)",
              // filter: `drop-shadow(0px 2px 8px var(--color-primary))`,
              // boxShadow: 'inset 0 2px 8px 0 var(--color-primary)',

              mt: 2,
              //   bgcolor: 'transparent',
              backgroundColor: "rgb(from var(--color-bg-glass) r g b / 25%)",

              backdropFilter: "blur(4px)",
              border: "1px solid var(--color-border-glass)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",

              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
          list: {
            className: "flex flex-col items-center justify-center px-4 m-0",
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <MenuItem
          className="flex items-center justify-center  my-2"
          size="small"
          component={Button}
          onClick={() => navigate("/settings/profile")}
        >
          Profile
        </MenuItem>
        <MenuItem
          className="flex items-center justify-center  my-2"
          size="small"
          component={Button}
          onClick={() => navigate("/settings/repositories")}
        >
          My Analyses
        </MenuItem>
      </Menu>
    </>
  );
}
