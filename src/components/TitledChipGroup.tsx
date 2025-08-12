import { Box, Chip  } from "@mui/material"; // Box is still useful for semantic containers
import Typography from "./atoms/Typography";
import clsx from 'clsx'; // A tiny, popular utility for constructing classNames conditionally

// ====================================================================
// 1. Create a reusable, styled chip component using MUI's Chip
// ====================================================================
interface StyledChipProps {
  label: string;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean; // Keep the disabled prop
}

const StyledChip = ({ label, isSelected, onClick, disabled }: StyledChipProps) => {
  // Base classes that apply to all chips, regardless of state
  const baseClasses = 'font-code border text-xs md:text-sm h-auto transition-colors duration-300';
  
  // Classes for an unselected chip
  const unselectedClasses = 'bg-bg-paper border-border text-text-secondary hover:border-secondary dark:hover:border-primary';

  // Classes for a selected chip
  const selectedClasses = 'dark:bg-primary/10 bg-secondary/5 dark:border-primary border-secondary text-text-secondary hover:bg-bg-hover';

  // Classes for a disabled chip (when "All" is selected)
  const disabledClasses = 'opacity-60 cursor-default hover:dark:bg-primary/10 hover:bg-secondary/5';

  return (
    <Chip
      label={label}
      onClick={!disabled ? onClick : undefined} // Only attach onClick if not disabled
      disabled={disabled}
      className={clsx(baseClasses, {
        [unselectedClasses]: !isSelected,
        [selectedClasses]: isSelected,
        [disabledClasses]: disabled,
      })}
      // sx prop is used here to override MUI's default styling completely,
      // allowing our Tailwind classes to take full control.
      sx={{
        '&.MuiChip-root': {
          // This ensures our padding classes work as expected.
          // MUI Chip has internal padding on its label that we need to handle.
          '.MuiChip-label': {
            padding: '0.375rem 0.75rem', // Corresponds to py-1.5 px-3
          },
        },
        // Reset hover effects so our Tailwind `hover:` classes can work
        '&.MuiChip-clickable:hover': {
          backgroundColor: 'inherit', // Let the className control the hover color
        },
        // Ensure disabled state doesn't add unwanted MUI styles
        '&.Mui-disabled': {
          opacity: 1, // Let our `disabledClasses` control the opacity
          pointerEvents: 'auto', // Allow us to use `cursor-default`
        },
      }}
    />
  );
};


// ====================================================================
// 2. Define the main component props (these are unchanged)
// ====================================================================
type TitledChipGroupProps = {
  title: string;
  options: string[];
  selection: string[];
  onChange: (event: React.MouseEvent<HTMLElement>, newSelection: string[]) => void;
  ariaLabel: string;
};


// ====================================================================
// 3. The main component now uses Tailwind and the new StyledChip
// ====================================================================
export const TitledChipGroup = ({
  title,
  options,
  selection,
  onChange,
  ariaLabel,
}: TitledChipGroupProps) => {
  // This handler logic remains exactly the same
  const handleChipClick = (
    clickedOption: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    let newSelection: string[];

    if (clickedOption === 'All') {
      newSelection = ['All'];
    } else {
      const currentSelection = selection.filter(s => s !== 'All');
      if (currentSelection.includes(clickedOption)) {
        newSelection = currentSelection.filter(s => s !== clickedOption);
      } else {
        newSelection = [...currentSelection, clickedOption];
      }
    }
    
    if (newSelection.length === 0) {
      newSelection = ['All'];
    }

    onChange(event, newSelection);
  };

  return (
    // We can still use MUI's Box for semantic grouping if we want
    <Box component="div" aria-label={ariaLabel}>
      <Typography gutterBottom className="text-sm md:text-lg text-text-primary">
        {title}
      </Typography>
      {/* This Box is replaced with a simple div with Tailwind flex utilities */}
      <div className="flex flex-wrap gap-2">
        {/* Render the "All" chip using our new styled component */}
        <StyledChip
          label="All"
          disabled={selection.includes('All')}
          onClick={(e) => handleChipClick('All', e)}
          isSelected={selection.includes('All')}
        />
        {/* Map over the rest of the options */}
        {options.map((option) => (
          <StyledChip
            key={option}
            label={option}
            onClick={(e) => handleChipClick(option, e)}
            isSelected={selection.includes(option)}
          />
        ))}
      </div>
    </Box>
  );
};