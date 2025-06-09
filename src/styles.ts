import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      semantic: {
        primary: {
          50: '{pink.50}',
          100: '{Yellow.100}',
          200: '{Yellow.200}',
          300: '{Yellow.300}',
          400: '{Yellow.400}',
          500: '{Yellow.500}',
          600: '{Yellow.600}',
          700: '{Yellow.700}',
          800: '{Yellow.800}',
          900: '{Yellow.900}',
          950: '{Yellow.950}',
        },
      },
      light: {
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{white.50}',
          100: '{white.100}',
          200: '{white.200}',
          300: '{white.300}',
          400: '{white.400}',
          500: '{white.500}',
          600: '{white.600}',
          700: '{white.700}',
          800: '{white.800}',
          900: '{white.900}',
          950: '{white.950}',
        },
      },
    },
  },
});
