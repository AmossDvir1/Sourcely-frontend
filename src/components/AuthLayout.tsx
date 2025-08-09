import { motion } from 'framer-motion';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* The animated grid background */}
      <div className="grid-background"></div>

      {/* A glassmorphism container for the form */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="w-full max-w-md bg-bg-default backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-500/10"
      >
        {children}
      </motion.div>
    </main>
  );
};