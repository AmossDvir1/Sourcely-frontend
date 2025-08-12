// In src/pages/PageLoader.tsx

import GlowingSpinner from "../components/atoms/GlowingSpinner";
import { motion } from "framer-motion";

/**
 * A full-page overlay loader with a fade-in/out animation.
 * It uses a fixed position to cover the entire viewport.
 */
const PageLoader: React.FC = () => {
  // Define the animation variants for Framer Motion
  const loaderVariants = {
    // The state when the component is not visible
    hidden: { 
      opacity: 0, 
      scale: 0.98, // A subtle shrink effect
      transition: { duration: 1.2, ease: "easeInOut" } 
    },
    // The state when the component is visible
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeInOut" }
    },
  } as const;

  return (
    <motion.div
      className="
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-background" // Use your Tailwind background color
      
      // Apply the variants
      variants={loaderVariants}
      initial="hidden"  // Start in the 'hidden' state
      animate="visible" // Animate to the 'visible' state when mounted
      exit="hidden"     // Animate to the 'hidden' state when unmounted
    >
      <GlowingSpinner />
    </motion.div>
  );
};

export default PageLoader;