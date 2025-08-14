import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Typography from "../components/atoms/Typography";
import Button from "../components/atoms/Button";
import { AuthLayout } from "../components/AuthLayout";
import TerminalIcon from "@mui/icons-material/Terminal";
import TextField from "../components/atoms/TextField";

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

export const LoginPage = () => {
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
      await login({ email, password });
      navigate(redirectPath || "/");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-8 flex flex-col gap-y-6"
      >
        <motion.div variants={itemVariants} className="text-center">
          <TerminalIcon sx={{ fontSize: 40, color: "var(--color-primary)" }} />
          <Typography
            code
            className="!text-3xl !font-bold mt-2 text-text-primary"
          >
            Welcome Back
          </Typography>
          <Typography className="text-text-secondary">
            Sign in to access your analyses
          </Typography>
        </motion.div>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4"
        >
          <motion.div variants={itemVariants}>
            <TextField
              required
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          {error && (
            <Typography color="error" className="text-center text-sm">
              {error}
            </Typography>
          )}

          <motion.div variants={itemVariants}>
            <Button type="submit" fullWidth size="large">
              Sign In
            </Button>
          </motion.div>
        </Box>

        <motion.div variants={itemVariants}>
          <Typography className="text-center text-text-secondary pt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline transition-colors"
            >
              Register
            </Link>
          </Typography>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};
