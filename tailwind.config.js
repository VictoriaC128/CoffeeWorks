/** @type {import('tailwindcss').Config} */

// Theme tokens live in src/index.css as RGB triplets so opacity modifiers work.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Roaster's Label: no rounded corners, no drop shadows
    borderRadius: { none: '0', DEFAULT: '0', sm: '0', md: '0', lg: '0', xl: '0', '2xl': '0', '3xl': '0', full: '9999px' },
    boxShadow: { none: 'none', DEFAULT: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none', '2xl': 'none', inner: 'none' },
    extend: {
      colors: {
        paper: v('paper'),
        ink: v('ink'),
        mute: v('mute'),
        rule: v('rule'),
        tint: v('tint'),
        flow: v('flow'),
        ok: v('ok'),
        bad: v('bad'),
        scrim: v('scrim'),
        mode: {
          espresso: v('m-espresso'),
          lever: v('m-lever'),
          moka: v('m-moka'),
          filter: v('m-filter'),
          immersion: v('m-immersion'),
          kopi: v('m-kopi'),
          other: v('m-other'),
        },
      },
      fontFamily: {
        sans: ['var(--font-ui)'],
        mono: ['var(--font-ui)'],
      },
    },
  },
  plugins: [],
};
