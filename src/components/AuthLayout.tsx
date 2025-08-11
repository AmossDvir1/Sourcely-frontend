import { motion } from 'framer-motion';

type AuthLayoutProps = {
  children: React.ReactNode;
};

// Animation variants for a consistent entrance effect
const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: -20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    // 1. GROUNDED & RESPONSIVE LAYOUT
    // By removing `min-h-screen` and `justify-center` and adding responsive vertical padding (py-12 sm:py-20),
    // the layout feels more compact and less stretched on tall screens.
    <main className="flex flex-col items-center p-4 overflow-hidden py-12 sm:py-20">
      
      {/* The grid background remains, providing ambient texture */}
      <div
        className="
          fixed inset-0 -z-10 pointer-events-none opacity-50
          bg-[linear-gradient(to_right,var(--color-grid-lines)_1px,transparent_1px),
             linear-gradient(to_bottom,var(--color-grid-lines)_1px,transparent_1px)]
          bg-[length:40px_40px]
          animate-pan-grid
        "
      />

      {/* 2. SOLID & THEMED CONTAINER (No more glass) */}
      <motion.div
        variants={FADE_IN_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md 
                   bg-bg-paper                // Use our solid card background
                    ring-1 ring-border/10            // Use our standard, crisp border
                   rounded-2xl
                   shadow-2xl shadow-primary/20  // A subtle, theme-colored glow
                   "
      >
        {children}
      </motion.div>
    </main>
  );
};