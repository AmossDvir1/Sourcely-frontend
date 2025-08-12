import Typography from "../components/atoms/Typography";
import Button from "../components/atoms/Button";
import { useAuth } from "../hooks/useAuth";
import Analyzer from "./analyzer/Analyzer";
import { useNavigate } from "react-router-dom";
import AnimatedTypography from "../components/atoms/AnimatedTypography";
import { useResponsive } from "../hooks/useResponsive";
import { motion } from "framer-motion";

// A simple animation variant for a staggered fade-in effect
const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

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
        <div className="min-h-full flex flex-col items-center justify-center px-2 sm:px-6 py-4 md:py-6">

      {/* 1. HEADLINE: Now with a vibrant theme gradient and animation */}
      <motion.div
        variants={FADE_IN_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <Typography
          code
          className="text-3xl text-center md:text-5xl font-medium leading-tight
                     text-text-primary"
        >
          AI-powered GitHub Repository Insights
        </Typography>
      </motion.div>

      {/* 2. ANIMATED TEXT: Now with animation */}
      <motion.div
        className="w-full"
        variants={FADE_IN_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatedTypography
          textSequence={animatedTextSequence}
          code
          className="text-base md:text-lg text-text-secondary text-center min-h-[50px] sm:min-h-[120px] mt-4 whitespace-pre-wrap"
          repeat={isMobile ? Infinity : 0}
        />
      </motion.div>

      {/* 3. ANALYZER: Wrapped in our new cyberpunk glass container and animated */}
      <motion.div
        className="w-full max-w-2xl mt-4 p-4 rounded-xl"
        variants={FADE_IN_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Analyzer />
      </motion.div>

      {/* 4. AUTHENTICATED ACTIONS: Now with animation */}
      <motion.div
        className="mt-0 md:mt-6"
        variants={FADE_IN_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {isAuthenticated && (
          <div className="flex flex-col">
            <Button onClick={() => navigate("/settings/repositories")}>
              View My Analyses
            </Button>
            
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;
