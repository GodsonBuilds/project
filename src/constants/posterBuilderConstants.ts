// ZenGrowth theme
export const THEME = {
  colors: {
    primary: '#27AE60', // ZenGrowth green
    secondary: '#2C3E50',
    accent: '#3498DB',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      tertiary: '#718096',
      onPrimary: '#FFFFFF',
    },
    border: '#E2E8F0',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

// Default values
export const DEFAULT_CANVAS = {
  width: 800,
  height: 600,
  backgroundColor: '#FFFFFF',
  backgroundImage: null,
  scale: 1,
  grid: {
    rows: 2,
    columns: 2,
    cells: [],
  },
  elements: [],
  title: {
    text: 'Poster Title',
    fontSize: 32,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#1A202C',
    backgroundColor: 'transparent',
    padding: 16,
    textAlign: 'center',
  },
};

export const DEFAULT_TEXT_ELEMENT = {
  content: 'Text Block',
  fontSize: 18,
  fontFamily: 'Poppins',
  fontWeight: '400',
  color: '#1A202C',
  backgroundColor: 'transparent',
  padding: 8,
  textAlign: 'left' as const,
  width: 200,
  height: 100,
  rotation: 0,
};

export const DEFAULT_EXPORT_OPTIONS = {
  format: 'png' as const,
  quality: 90,
  fileName: 'zengrowth-poster',
};

export const FONT_FAMILIES = [
  'Poppins',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
];

export const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
];

export const TEXT_ALIGNMENTS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export const EXPORT_FORMATS = [
  { label: 'PNG', value: 'png' },
  { label: 'JPG', value: 'jpg' },
  { label: 'WEBP', value: 'webp' },
];