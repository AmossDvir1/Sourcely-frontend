import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Button from "./atoms/Button";
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
      {/* 1. THEME-AWARE GRID BACKGROUND */}
      <div
        className="
          fixed inset-0 -z-10 pointer-events-none opacity-50
          bg-[linear-gradient(to_right,var(--color-grid-lines)_1px,transparent_1px),
             linear-gradient(to_bottom,var(--color-grid-lines)_1px,transparent_1px)]
          bg-[length:40px_40px]
          animate-pan-grid
        "
      />
      {/* 2. THEME-AWARE MAIN CONTAINER */}
      <div
        className="
          flex flex-col min-h-screen
          bg-bg-default text-text-primary
          transition-colors duration-300
        "
      >
        {/* 3. THEME-AWARE HEADER (Glassmorphism with border) */}
        <header className="w-full bg-bg-paper/50 dark:bg-bg-paper/50 backdrop-blur-[6px] border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <motion.div // Using div for better layout control
              onClick={() => navigate("/")}
              className="cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                code
                className="text-xl md:text-2xl font-extrabold
                text-text-primary hover:text-primary transition"
              >
                Sourcely
              </Typography>
            </motion.div>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <LogoutButton />
                  <UserSettings />
                </>
              ) : (
                <>
                  {/* 4. CLEANED UP BUTTONS */}
                  <Button onClick={() => navigate("/login")} size="small">
                    Sign In
                  </Button>
                  <Button
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
        <main className="flex-grow w-full flex flex-col items-center justify-center px-2 sm:px-6 py-8 sm:py-12">
          {/* 5. THEME-AWARE CONTENT CARD (Crisp outline instead of shadow) */}
          <div className="w-full max-w-4xl bg-bg-paper ring-1 ring-border rounded-2xl p-4 sm:p-8">
            {children || <Outlet />}
          </div>
        </main>

        {/* 6. THEME-AWARE FOOTER */}
        <footer className="w-full bg-bg-paper/80 dark:bg-bg-paper/80 backdrop-blur-sm border-t border-border py-6 px-4 sm:px-6">
          <div className="flex items-center justify-center text-center ">
            <Typography className="text-sm hover:text-primary w-fit">
            © {new Date().getFullYear()} Sourcely. Built with ❤️ using React,
            TypeScript, Vite, TailwindCSS, and MUI.</Typography>
          </div>
        </footer>
      </div>
    </>
  );
}