import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import Analyzer from "./pages/analyzer/Analyzer";
import "./App.css";
import ThemeTest from "./pages/ThemeTest";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/theme" element={<ThemeTest />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/"
          element={
            <PrivateRoute>
              <Analyzer />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
