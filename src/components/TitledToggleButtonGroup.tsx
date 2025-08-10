import {
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Typography from "./atoms/Typography";
type TitledToggleButtonGroupProps = {
  /** The text to display as a title above the button group. */
  title: string;
  /** An array of strings representing the individual options to display. */
  options: string[];
  /** The current array of selected option values. */
  selection: string[];
  /** The callback function invoked when the selection changes. */
  onChange: (event: React.MouseEvent<HTMLElement>, newSelection: string[]) => void;
  /** A descriptive label for accessibility. */
  ariaLabel: string;
};

export const TitledToggleButtonGroup = ({
  title,
  options,
  selection,
  onChange,
  ariaLabel,
}: TitledToggleButtonGroupProps) => {
  // Determine if "All" is selected to correctly disable the button.
  const isAllSelected = selection.includes('All');

  return (
    <div>
      <Typography gutterBottom className="text-base sm:text-lg">
        {title}
      </Typography>
      <ToggleButtonGroup
        value={selection}
        onChange={onChange}
        color="primary"
        aria-label={ariaLabel}
        // These styles ensure the component is responsive and spaced correctly.
        sx={{ flexWrap: 'wrap', gap: 0 }}
      >
        {/* The "All" button is a permanent part of this component's UI */}
        <ToggleButton  value="All" disabled={isAllSelected} disableRipple>
          All
        </ToggleButton>
        {/* Map over the provided options to create the rest of the buttons */}
        {options.map((option) => (
          <ToggleButton key={option} value={option} disableRipple>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};