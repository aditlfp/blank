/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * This palette is inspired by calm, minimalist Japanese aesthetics.
 */

// A muted, calming teal for the primary accent.
const tintColorLight = '#5A9A9A';
// A slightly brighter teal for better contrast in dark mode.
const tintColorDark = '#6ABDBB';

export const Colors = {
  light: {
    text: '#2A2A2A', // Dark charcoal grey, not pure black
    background: '#F5F5F5', // Soft, off-white, like washi paper
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#EAEAEA', // Light, warm grey
    background: '#1C1C1E', // Very dark, slightly warm grey
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
