import React from 'react';
import MuiTypography, { type TypographyProps as MuiTypographyProps } from '@mui/material/Typography';
import clsx from 'clsx';

export interface TypographyProps extends MuiTypographyProps {
  /**
   * When true, applies the code font style (`font-code`).
   * Otherwise, defaults to the sans font style (`font-sans`).
   */
  code?: boolean;
  /**
   * Apply additional letter spacing. Defaults to a slight spread (`tracking-wide`).
   * Pass `false` to disable spacing or specify a custom Tailwind tracking class.
   */
  tracking?: boolean | string;
  /**
   * Apply line-height spacing. Defaults to relaxed line height (`leading-relaxed`).
   * Pass `false` to disable or provide a custom Tailwind leading class.
   */
  leading?: boolean | string;
}

const Typography: React.FC<TypographyProps> = ({
  code = false,
  tracking = true,
  leading = false,
  className,
  ...rest
}) => {
  const fontClass = code ? 'font-code' : 'font-sans';
  const trackingClass =
    typeof tracking === 'string' ? tracking : tracking ? 'tracking-widest' : '';
  const leadingClass =
    typeof leading === 'string' ? leading : leading ? 'leading-7' : '';

  return (
    <MuiTypography
      className={clsx(fontClass, trackingClass, leadingClass, className)}
      color={'text.primary'}
      {...rest}
    />
  );
};

export default Typography;
