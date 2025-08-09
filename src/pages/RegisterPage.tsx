// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // You'll need a register function here
import { useNavigate, Link } from "react-router-dom";
import { TextField, styled, Box } from "@mui/material";
import { AuthLayout } from "../components/AuthLayout";
import TerminalIcon from "@mui/icons-material/Terminal";
import { register as apiRegister } from "../api/authService"; // Assuming you have this
import Typography from "../components/atoms/Typography";
import { CustomButton as Button } from "../components/atoms/CustomButton";

// Reuse the styled text field from the login page
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(0,0,0,0.3)",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
    "&.Mui-focused": {
      backgroundColor: "rgba(0,0,0,0.5)",
      boxShadow: "0 0 15px rgba(51, 153, 255, 0.4)",
    },
  },
  "& label.Mui-focused": { color: "#3399FF" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&:hover fieldset": { borderColor: "#3399FF" },
    "&.Mui-focused fieldset": { borderColor: "#3399FF" },
  },
});

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // We'll login immediately after successful registration
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiRegister({ username, email, password });
      // Automatically log the user in after they register
      await login({ email, password });
      navigate("/");

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setError("Registration failed. Please try a different email.");
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      <Box component="form" onSubmit={handleSubmit} className="p-8 space-y-6">
        <Box className="text-center mb-6">
          <TerminalIcon sx={{ fontSize: 40, color: "#3399FF" }} />
          <Typography component="h1" variant="h4" className="!font-bold mt-2">
            Create Account
          </Typography>
          <Typography className="text-gray-400">Join Sourcely</Typography>
        </Box>

        <StyledTextField
          label="Username"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledTextField
          label="Email Address"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledTextField
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,
            fontWeight: 600,
            transition: "all 0.3s ease",
            boxShadow: "0 0 10px rgba(51, 153, 255, 0.5)",
            "&:hover": {
              boxShadow: "0 0 25px rgba(51, 153, 255, 0.8)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Create Account
        </Button>

        <Typography className="text-center text-gray-400 pt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#3399FF] hover:underline"
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};
