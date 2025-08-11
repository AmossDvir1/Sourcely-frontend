import clsx from "clsx";

interface GlowingSpinnerProps {
  /**
   * Allows adding extra classes for layout (e.g., margins).
   */
  className?: string;
  /**
   * Defines the spinner size. Defaults to "responsive".
   * 'responsive': Scales from medium to large.
   * 'small', 'medium', 'large': Fixed sizes.
   */
  size?: "small" | "medium" | "large" | "responsive";
}

// These are the different blur levels for the glowing layers
const blurLevels = ["blur-[5px]", "blur-[10px]", "blur-[25px]", "blur-[50px]"];

// --- STEP 1: Define size mappings for different parts of the component ---

// Defines the h- and w- for the main container
const containerSizeClasses = {
  small: "h-12 w-12", // 48px
  medium: "h-16 w-16", // 64px
  large: "h-24 w-24", // 96px
  responsive: "h-16 w-16 md:h-24 md:w-24", // Starts medium, grows to large
};

// Defines the `inset` for the inner white circle, proportional to the container size
const innerCircleInsetClasses = {
  small: "inset-[5px]",
  medium: "inset-[7px]",
  large: "inset-[10px]",
  responsive: "inset-[7px] md:inset-[10px]",
};

const GlowingSpinner = ({
  className,
  // STEP 2: Set the default size to "responsive"
  size = "responsive",
}: GlowingSpinnerProps) => {
  return (
    // The main container
    <div
      className={clsx(
        "relative rounded-full animate-spin-glow",
        "bg-gradient-to-br from-primary to-secondary",
        // STEP 3: Apply the dynamic container size
        containerSizeClasses[size],
        className
      )}
    >
      {/* The glowing layers */}
      {blurLevels.map((blur) => (
        <span
          key={blur}
          className={clsx(
            "absolute inset-0 h-full w-full rounded-full",
            "bg-gradient-to-br from-primary to-secondary",
            blur
          )}
        />
      ))}

      {/* The inner circle */}
      <div
        className={clsx(
          "absolute rounded-full bg-bg-paper",
          // STEP 4: Apply the dynamic inset size
          innerCircleInsetClasses[size]
        )}
      ></div>
    </div>
  );
};

export default GlowingSpinner;