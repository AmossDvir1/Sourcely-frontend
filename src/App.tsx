import { Routes, Route, Navigate } from "react-router-dom";
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
import AnalysisViewerPage from "./pages/analyzer/AnalysisViewerPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />

        <Route path="/theme" element={<ThemeTest />} />
        <Route
          path="/analysis/view/:analysisId"
          element={<AnalysisViewerPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/settings" element={<SettingsPage />}>
            {/* Redirects /settings to /settings/profile by default */}
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="repositories" element={<AnalysesSettings />} />
          </Route>
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
