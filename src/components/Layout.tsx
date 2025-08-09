import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { CustomButton as Button } from "./atoms/CustomButton";
import LogoutButton from "./LogoutButton";
import Typography from "./atoms/Typography";
import UserSettings from "./UserSettings";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div
        className="
          fixed inset-0 -z-10 pointer-events-none opacity-25
          bg-[linear-gradient(to_right,rgba(66,153,225,0.05)_1px,transparent_1px),
             linear-gradient(to_bottom,rgba(66,153,225,0.05)_1px,transparent_1px)]
          bg-[length:40px_40px]
          animate-pan-grid
        "
      />
      <div
        className="
          flex flex-col min-h-screen
          bg-gradient-to-br from-blue-50 to-white
          dark:from-gray-900 dark:to-gray-800
          text-gray-900 dark:text-gray-100
          transition-colors duration-500
        "
      >
        {/* Header */}
        <header className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.label
              onClick={() => navigate("/")}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                code
                className="text-2xl font-extrabold cursor-pointer
                hover:text-primary
                transition"
              >
                Sourcely
              </Typography>
            </motion.label>
            <nav className="flex items-center space-x-2  md:space-x-4 lg:space-x-6">
              {isAuthenticated ? (
                <>
                  <LogoutButton />
                  <UserSettings />
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 rounded-lg  transition-shadow shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </Button>
                  <Button
                    typographyProps={{ className: "" }}
                    onClick={() => navigate("/register")}
                    theme="secondary"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <ThemeToggleButton />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
            {children || <Outlet />}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-6">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Sourcely. Built with ❤️ using React,
            TypeScript, Vite, TailwindCSS, and MUI.
          </div>
        </footer>
      </div>
    </>
  );
}
