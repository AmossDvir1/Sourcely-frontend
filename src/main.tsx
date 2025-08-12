import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CustomThemeProvider } from "./theme/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";

// MUI Imports
import { CssBaseline, StyledEngineProvider } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />

      <BrowserRouter>
          <CustomThemeProvider>
        <AuthProvider>
            <CssBaseline />
            <App />
        </AuthProvider>
          </CustomThemeProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);
