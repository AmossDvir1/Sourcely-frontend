import { Routes, Route, Navigate  } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import "./App.css";
import ThemeTest from "./pages/ThemeTest";
import SettingsPage from "./pages/settings/SettingsPage";
import AnalysesSettings from "./pages/settings/AnalysesSettings";
import ProfileSettings from "./pages/settings/ProfileSettings";
import AnalysisDisplayTest from "./pages/AnalysisDisplayTest";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/theme" element={<ThemeTest />} />
        <Route path="/testanalysis" element={<AnalysisDisplayTest />} />

        
        <Route path="/register" element={<RegisterPage />} />

          <Route path="/settings" element={<SettingsPage />}>
            {/* Redirects /settings to /settings/profile by default */}
            <Route index element={<Navigate to="profile" replace />} /> 
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="repositories" element={<AnalysesSettings />} />
          </Route>
      </Routes>
    </Layout>
  );
}

export default App;
