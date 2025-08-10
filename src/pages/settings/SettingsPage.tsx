import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typography from '../../components/atoms/Typography';

const tabs = [
  { name: 'Profile', path: 'profile' },
  { name: 'My Analyses', path: 'repositories' },
];

export default function SettingsPage() {
  // Style for the active tab
  const activeLinkStyle = {
    color: 'var(--color-primary)', // Using a CSS variable for your theme's primary color
    borderColor: 'var(--color-primary)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Typography variant="h3" className="mb-2 font-bold">Settings</Typography>
      <Typography variant="body1" className="text-gray-500 dark:text-gray-400 mb-8">
        Manage your account settings, profile, and repository analyses.
      </Typography>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) => `
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md
                transition-colors duration-200
                ${!isActive ? 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' : ''}
              `}
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Nested Route Content Renders Here */}
      <Outlet />
    </motion.div>
  );
}