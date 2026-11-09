/** @type {import('tailwindcss').Config} */

// Spacing scale mirrors the reference: numeric keys are tenths of a rem
// (pt-120 = 12rem). The root font-size is fluid (see global.css), so the
// whole layout scales with the viewport exactly like the original.
const spacing = {};
for (let i = 0; i <= 400; i++) spacing[i] = `${i / 10}rem`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1200px',
    },
    extend: {
      colors: {
        // KYNORA palette, mapped onto the reference's token roles
        // Values live as CSS variables in global.css so the DialKit
        // "Global" panel can recolour the whole site live.
        orange: 'rgb(var(--rgb-orange) / <alpha-value>)', // accent (reference: red-light)
        cream: 'rgb(var(--rgb-cream) / <alpha-value>)', // main light bg (reference: beige-dark)
        beige: 'rgb(var(--rgb-beige) / <alpha-value>)', // secondary / trail lines
        brown: 'rgb(var(--rgb-brown) / <alpha-value>)', // dark section bg (reference: purple-light)
        ink: 'rgb(var(--rgb-ink) / <alpha-value>)', // text dark (reference: purple-dark)
        white: 'rgb(var(--rgb-white) / <alpha-value>)', // header / footer bg (reference: beige-light)
        'brown-deep': 'rgb(var(--rgb-brown-deep) / <alpha-value>)', // muted placeholder text on brown
      },
      spacing: {
        ...spacing,
        margin: 'var(--margin)',
        gutter: 'var(--gutter)',
        header: 'var(--header-height)',
      },
      fontFamily: {
        heading: ['"League Gothic"', 'Impact', 'sans-serif'],
        body: ['"Figtree Variable"', 'Figtree', 'system-ui', 'sans-serif'],
      },
      height: {
        screen: '100vh',
        'screen-mobile': 'var(--vh)',
      },
      minHeight: {
        screen: '100vh',
        'screen-mobile': 'var(--vh)',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        header: '50',
        loader: '100',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '300ms',
        normal: '500ms',
        smooth: '800ms',
      },
    },
  },
  plugins: [],
};
