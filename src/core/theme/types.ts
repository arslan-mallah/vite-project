/**
 * Theme Types and Interfaces
 */

export interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  successColor: string;
  errorColor: string;
  warningColor: string;
  infoColor: string;
  borderRadius: string;
  fontFamily: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  importTheme: (jsonString: string) => boolean;
  currentThemeName: string;
}

// Light Theme (Default)
export const lightTheme: Theme = {
  name: 'Light',
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderColor: '#e0e0e0',
  successColor: '#4CAF50',
  errorColor: '#f44336',
  warningColor: '#ff9800',
  infoColor: '#2196F3',
  borderRadius: '8px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// Dark Theme
export const darkTheme: Theme = {
  name: 'Dark',
  primaryColor: '#bb86fc',
  secondaryColor: '#03dac6',
  backgroundColor: '#121212',
  textColor: '#e1e1e1',
  borderColor: '#404040',
  successColor: '#81c784',
  errorColor: '#cf6679',
  warningColor: '#ffb74d',
  infoColor: '#64b5f6',
  borderRadius: '8px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// Ocean Theme
export const oceanTheme: Theme = {
  name: 'Ocean',
  primaryColor: '#0077be',
  secondaryColor: '#0096ff',
  backgroundColor: '#e8f4f8',
  textColor: '#003d5c',
  borderColor: '#a8d5e6',
  successColor: '#00a651',
  errorColor: '#d32f2f',
  warningColor: '#ff8c00',
  infoColor: '#1976d2',
  borderRadius: '12px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// Forest Theme
export const forestTheme: Theme = {
  name: 'Forest',
  primaryColor: '#2d5016',
  secondaryColor: '#558b2f',
  backgroundColor: '#f1f5e8',
  textColor: '#1b3a0d',
  borderColor: '#9ccc65',
  successColor: '#558b2f',
  errorColor: '#c62828',
  warningColor: '#f57c00',
  infoColor: '#1565c0',
  borderRadius: '10px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// Sunset Theme
export const sunsetTheme: Theme = {
  name: 'Sunset',
  primaryColor: '#ff6b6b',
  secondaryColor: '#feca57',
  backgroundColor: '#fff5e6',
  textColor: '#4a4a4a',
  borderColor: '#ffb3a0',
  successColor: '#20c997',
  errorColor: '#ff6b6b',
  warningColor: '#feca57',
  infoColor: '#4c6ef5',
  borderRadius: '15px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    small: '12px',
    medium: '14px',
    large: '16px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

// All available themes
export const themePresets: Theme[] = [lightTheme, darkTheme, oceanTheme, forestTheme, sunsetTheme];

// Default theme
export const defaultTheme: Theme = lightTheme;
