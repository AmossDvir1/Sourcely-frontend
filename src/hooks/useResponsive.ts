import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useResponsive = () => {
  const theme = useTheme(); // MUI's theme provides breakpoint helpers which are already configured.

  // `useMediaQuery` returns true if the query matches the theme's breakpoints.
  // 'sm' typically corresponds to 640px, 'md' to 768px in default Tailwind/MUI setups.
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Screens < 640px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Screens >= 640px and < 768px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // Screens >= 768px

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};