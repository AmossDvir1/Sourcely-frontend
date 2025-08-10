import Typography from "../components/atoms/Typography";
import { CustomButton as Button } from "../components/atoms/CustomButton";
import { useAuth } from "../hooks/useAuth";
import Analyzer from "./analyzer/Analyzer";
import { useNavigate } from "react-router-dom";
import AnimatedTypography from "../components/atoms/AnimatedTypography";
import { useResponsive } from "../hooks/useResponsive";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isMobile } = useResponsive(); // Step 2: Use the hook

  // --- Step 3: Define text sequences based on screen size ---

  // Full, detailed sequence for desktop
  const desktopSequence = [
    "Sourcely helps developers instantly analyze public GitHub repos...",
    1000,
    "Sourcely helps developers instantly analyze public GitHub repos... by generating smart AI surmmareis,,",
    1200,
    "Sourcely helps developers instantly analyze public GitHub repos... by generating smart AI summaries,",
    800,
    "Sourcely helps developers instantly analyze public GitHub repos... by generating smart AI summaries, detailed setup insyructions,",
    800,
    "Sourcely helps developers instantly analyze public GitHub repos... by generating smart AI summaries, detailed setup instructions,",
    1500,
    "Sourcely helps developers instantly analyze public GitHub repos... by generating smart AI summaries, detailed setup instructions, and a full architecture overview.",
    1350,
    "Sourcely helps developers instantly analyze public GitHub repos... by generating smart AI summaries, detailed setup instructions, and a full architecture overview.\nJust enter a GitHub URL to get started.",
    1200,
  ];

  // Shorter, punchier sequence for mobile
  const mobileSequence = [
    "Instantly analyze any public GitHub repository.",
    1500,
    "Get AI-powered summaries, setup instructions, and more.",
    1500,
    "Just enter a GitHub URL to get started.",
    2000,
  ];

  // Use the appropriate sequence based on the device
  const animatedTextSequence = isMobile ? mobileSequence : desktopSequence;

  return (
    // The main container now has responsive vertical padding
    <div className="min-h-full flex flex-col items-center justify-between px-2 sm:px-6 py-4 md:py-6 transition-colors duration-500 ">
      <div>
        {/* Main headline has responsive text size */}
        <Typography
          code
          className="text-3xl text-center md:text-5xl font-extrabold leading-tight"
        >
          AI-powered GitHub Repository Insights
        </Typography>
      </div>
      <AnimatedTypography
        textSequence={animatedTextSequence}
        code
        // Container has responsive height and text size
        className="text-base md:text-lg text-center min-h-[140px] sm:min-h-[170px] mt-4 whitespace-pre-wrap"
        repeat={isMobile ? Infinity : 0} // Optional: repeat animation on mobile
      />

      <Analyzer />

      {isAuthenticated ? (
        <div className="flex flex-col mt-6">
          <Button onClick={() => navigate("/settings/repositories")}>
            View My Analyses
          </Button>
        </div>
      ) : (
        // Action buttons stack vertically on mobile and go horizontal on larger screens
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button onClick={() => navigate("/login")}>Sign In</Button>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Create Account
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;