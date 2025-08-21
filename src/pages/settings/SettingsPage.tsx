import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Typography from '../../components/atoms/Typography';

const tabs = [
  { name: 'Profile', path: 'profile' },
  { name: 'My Analyses', path: 'repositories' },
];

export default function SettingsPage() {
  const activeLinkStyle = {
    color: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    backgroundColor: 'var(--color-bg-hover)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="px-4 sm:px-0">
        <Typography variant="h3" className="mb-2 !text-2xl sm:!text-4xl font-bold">Settings</Typography>
        <Typography variant="body1" className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
          Manage your account settings, profile, and repository analyses.
        </Typography>
      </div>

      <div className="mb-6 sm:mb-8">
        <nav className="flex flex-col sm:flex-row sm:space-x-6 sm:border-b sm:border-gray-200 sm:dark:border-gray-700" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) => `
                whitespace-nowrap py-3 px-4 font-medium text-md text-center
                border-b-2 sm:border-b-2
                transition-colors duration-200 rounded-t-lg
                ${!isActive
                  ? 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  : ''
                }
              `}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4 sm:px-0 min-h-[25rem]">
        <AnimatePresence mode="wait">
          {/* 
            The Outlet itself is the dynamic part. AnimatePresence will now
            detect when ProfileSettings is swapped for AnalysesSettings and
            animate them correctly based on their *own* animation props.
          */}
          <Outlet />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}