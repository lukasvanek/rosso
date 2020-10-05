import { lighten, opacify } from 'polished';

export const colors = {
  text: 'white',
  background: '#000000',
  primary: '#000000',
  secondary: '#03dac6',
  muted: '#f6f6f6',
  gray: 'rgba(178, 202, 255, 0.4)',
  purple: '#cf1fd7',
  red: '#f74646',
  green: '#00b188',
  yellow: '#ffe166',
};

export const preset = {
  colors,
  fonts: {
    body: 'beau, sans-serif',
    heading: 'beau, sans-serif',
    monospace: '"Roboto Mono", monospace',
  },
  fontSizes: [10, 12, 14, 16, 20, 24, 34, 48, 60, 96],
  fontWeights: {
    body: 400,
    heading: 400,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.2,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    icon: 24,
    avatar: 48,
  },
  radii: {
    default: 6,
    circle: 99999,
  },
  shadows: {
    // source: https://medium.com/@Florian/freebie-google-material-design-shadow-helper-2a0501295a2d
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
  },
  // rebass variants
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      color: colors.text,
    },
    display: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: [6, 7],
      color: colors.text,
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.2rem',
      fontWeight: 300,
      color: colors.text,
    },
    caps1: {
      variant: 'text.caps',
      marginBottom: '1rem',
      fontSize: 1,
    },
  },
  variants: {
    avatar: {
      width: 'avatar',
      height: 'avatar',
      borderRadius: 'circle',
    },
    card: {
      p: 2,
      bg: 'background',
      boxShadow: 2,
    },
    link: {
      color: 'primary',
    },
    nav: {
      variant: 'text.caps',
      fontSize: 1,
      fontWeight: 'bold',
      display: 'inline-block',
      p: 2,
      color: 'inherit',
      textDecoration: 'none',
      ':hover,:focus,.active': {
        color: 'primary',
      },
    },
  },
  forms: {
    input: {
      paddingX: 20,
      borderRadius: 9999,
      transition: 'all 140ms ease-in-out',
      color: colors.gray,
      ':hover': {
        color: opacify(0.1, colors.gray),
      },
      ':focus,.active': {
        color: 'primary',
      },
    },
    select: {
      paddingX: 20,
      borderRadius: 9999,
      transition: 'all 140ms ease-in-out',
      color: colors.gray,
      ':hover': {
        color: opacify(0.1, colors.gray),
      },
      ':focus,.active': {
        color: 'primary',
      },
    },
    textarea: {},
    label: {
      whiteSpace: 'nowrap',
      variant: 'text.caps',
      fontSize: '0.6rem',
      letterSpacing: '0.1rem',
      position: 'relative',
      bottom: '-0.3rem',
      left: '18px',
      background: colors.background,
      width: 'min-content',
      padding: '0 1px 0 3px',
      color: colors.gray,
      ':focus,.active': {
        color: 'primary',
      },
    },
    radio: {},
    checkbox: {},
  },
  buttons: {
    primary: {
      variant: 'text.caps',
      marginRight: 10,
      padding: '10px 20px',
      fontFamily: 'body',
      fontSize: '0.7rem',
      fontWeight: 300,
      whiteSpace: 'nowrap',
      borderRadius: 99999,
      cursor: 'pointer',
      backgroundColor: 'primary',
      position: 'relative',
      zIndex: 1,
      transition: 'all 140ms ease-in-out',
      ':active': {
        transform: 'scale(0.85)',
      },
      '& svg': {
        marginBottom: '-1px',
      },
    },
    outline: {
      variant: 'buttons.primary',
      color: 'primary',
      background: 'transparent',
      border: '1px solid',
      '::before': {
        backgroundImage: 'none',
      },
      ':hover': {
        color: lighten(0.1, colors.primary),
        borderColor: lighten(0.1, colors.primary),
      },
      '&.active': {
        color: 'white',
        borderColor: 'white',
      },
    },
    circle: {
      background: 'primary',
      width: '35px',
      height: '35px',
      borderRadius: 99999,
      color: 'white',
      cursor: 'pointer',
      padding: 0,
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'white',
      backgroundImage: `linear-gradient(36deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      '::before': {
        position: 'absolute',
        content: '""',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: '2rem',
        backgroundImage: `linear-gradient(36deg, ${lighten(
          0.1,
          colors.primary
        )} 0%, ${lighten(0.1, colors.secondary)} 100%)`,
        zIndex: -1,
        transition: 'opacity 140ms linear',
        opacity: 0,
      },
      ':hover::before': {
        opacity: 1,
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
  },
};

export default preset;
