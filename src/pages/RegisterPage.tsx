import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { AuthLayout } from "../components/AuthLayout";
import TerminalIcon from "@mui/icons-material/Terminal";
import { register as apiRegister } from "../api/authService";
import Typography from "../components/atoms/Typography";
// Import our reusable, themed components
import Button from "../components/atoms/Button";
import TextField from "../components/atoms/TextField";

// Animation variants, copied directly from LoginPage for consistency
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// The StyledTextField component is no longer needed.

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Find the redirect path from the URL query
    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get("redirect");
    try {
      await apiRegister({ username, email, password });
      await login({ email, password });
      navigate(redirectPath || "/");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setError(
        "Registration failed. Please try a different email or username."
      );
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      {/* Replicate the exact motion layout from LoginPage */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-8 flex flex-col gap-y-6"
      >
        {/* 1. THEMED HEADER */}
        <motion.div variants={itemVariants} className="text-center">
          <TerminalIcon sx={{ fontSize: 40, color: "var(--color-primary)" }} />
          <Typography
            code
            className="!text-3xl !font-bold mt-2 text-text-primary"
          >
            Create Account
          </Typography>
          <Typography className="text-text-secondary">
            Join to get started
          </Typography>
        </motion.div>

        {/* 2. THEMED FORM WITH STAGGERED ANIMATIONS */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4"
        >
          <motion.div variants={itemVariants}>
            <TextField
              autoComplete={"off"}
              slotProps={{ input: { autoComplete: "off" } }}
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setUsername(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              required
              fullWidth
              label="Email Address"
              slotProps={{ input: { autoComplete: "off" } }}
              type="email"
              value={email}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setEmail(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              slotProps={{ input: { autoComplete: "new-password" } }}
              value={password}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setPassword(e.target.value)}
            />
          </motion.div>

          {error && (
            <Typography color="error" className="text-center text-sm">
              {error}
            </Typography>
          )}

          <motion.div variants={itemVariants}>
            {/* Use our custom, themed Button */}
            <Button type="submit" fullWidth size="large">
              Create Account
            </Button>
          </motion.div>
        </Box>

        {/* 3. THEMED FOOTER LINK */}
        <motion.div variants={itemVariants}>
          <Typography className="text-center text-text-secondary pt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline transition-colors"
            >
              Sign In
            </Link>
          </Typography>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};
