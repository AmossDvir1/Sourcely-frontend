import { TypeAnimation } from 'react-type-animation';
import Typography, { type TypographyProps } from './Typography';

interface AnimatedTypographyProps extends TypographyProps {
  textSequence: (string | number)[];
  repeat?: number; // Allow repeat count or Infinity
}

const AnimatedTypography = ({ textSequence, repeat=0, ...rest }: AnimatedTypographyProps) => {
  return (
    <Typography {...rest}>
      <TypeAnimation
        preRenderFirstString
        sequence={textSequence}
        wrapper="span"
        speed={40} // Base speed (lower is faster). Perceived speed comes from pauses.
        cursor={true}
        repeat={repeat}
      />
    </Typography>
  );
};

export default AnimatedTypography;