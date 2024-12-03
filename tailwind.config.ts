import colors from 'tailwindcss/colors';

const config = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Tremor's module
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    transparent: 'transparent',
    current: 'currentColor',
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1800px',
    },
    extend: {
      colors: {
        primary: {
          500: '#534CFB',
        },
        gray: {
          50: '#F8FAFC',
          200: '#E3E8EF',
          400: '#97A3B6',
          500: '#677489',
          600: '#4A5567',
          800: '#20293A',
          900: '#111729',
        },
        blue: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#004AAD', // blue from Figma
          700: '#003D80',
          800: '#002F52',
          900: '#001F33',
        },
        danger: {
          500: '#FE4A22',
        },
        success: {
          500: '#42D0A1',
        },
        landing: '#f6f9fc',
        // Tremor's light mode
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },

        // dark mode
        'dark-tremor': {
          brand: {
            faint: '#0B1229',
            muted: colors.blue[950],
            subtle: colors.blue[800],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            inverted: colors.blue[950],
          },
          background: {
            muted: '#131A2B',
            subtle: colors.gray[800],
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
          },
          border: {
            DEFAULT: colors.gray[700],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
          content: {
            subtle: colors.gray[600],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            strong: colors.gray[50],
            inverted: colors.gray[950],
          },
        },
      },
      boxShadow: {
        // Tremor's light
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card':
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-dropdown':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        // Tremor's dark
        'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'dark-tremor-card':
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'dark-tremor-dropdown':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        header:
          '1px 4px 6px 0px rgba(32, 41, 58, 0.06), -1px -1px 6px 0px rgba(32, 41, 58, 0.05)',
        badge:
          '0px 1.643px 1.643px 0px rgba(146, 156, 196, 0.24), 0px 0px 4.107px 0px rgba(146, 156, 196, 0.02)',
        card: '0px 8px 24px -4px rgba(14, 63, 126, 0.08), 0px 2px 4px -1px rgba(14, 63, 126, 0.02)',
        pricingToggle:
          '0px 0px 0px 1px rgba(227, 232, 239, 0.60), 0px 1px 2px 0px rgba(227, 232, 239, 0.08), 0px 4px 6px 0px rgba(227, 232, 239, 0.08), 0px 12px 16px 0px rgba(227, 232, 239, 0.06)',
        pricingCard:
          '0px 0px 0px 1px rgba(14, 63, 126, 0.04), 0px 1px 1px -0.5px rgba(42, 51, 69, 0.04), 0px 3px 3px -1.5px rgba(42, 51, 70, 0.04), 0px 6px 6px -3px rgba(42, 51, 70, 0.04), 0px 12px 12px -6px rgba(14, 63, 126, 0.04), 0px 24px 24px -12px rgba(14, 63, 126, 0.04)',
        disclosure:
          '0px 0px 0px 1px rgba(14, 63, 126, 0.04), 0px 1px 1px -0.5px rgba(42, 51, 69, 0.04), 0px 3px 3px -1.5px rgba(42, 51, 70, 0.04), 0px 6px 6px -3px rgba(42, 51, 70, 0.04), 0px 12px 12px -6px rgba(14, 63, 126, 0.04), 0px 24px 24px -12px rgba(14, 63, 126, 0.04)',
      },
      borderRadius: {
        // Tremor's
        'tremor-small': '0.375rem',
        'tremor-default': '0.5rem',
        'tremor-full': '9999px',
      },
      fontSize: {
        // Tremor's
        'tremor-label': ['0.75rem'],
        'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
        'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
        'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontFamily: {
        sans: 'circular, SFMono-Regular, inter, sans-serif',
      },
      minWidth: {
        '40': '10rem',
        '60': '15rem',
        '80': '20rem',
        '100': '25rem',
        full: '100%',
      },
      maxWidth: {
        '120': '30rem',
        '160': '40rem',
        '200': '50rem',
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('daisyui'),
    require('@tailwindcss/forms'),
  ],
  daisyui: {
    themes: ['emerald'],
  },
  // Tremor's
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
};

export default config;
