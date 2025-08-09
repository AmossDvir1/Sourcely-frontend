import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../theme/useTheme";

export const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip
      title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <IconButton
        onClick={() => {
          toggleTheme();
        }}
        color="inherit"
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};
