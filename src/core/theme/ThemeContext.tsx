import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Theme, ThemeContextValue } from './types';
import { defaultTheme } from './types';

/**
 * ThemeContext - Global theme state management
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * ThemeProvider Component
 * Provides theme state and methods to all child components
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load theme from localStorage
    try {
      const saved = localStorage.getItem('appTheme');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage:', e);
    }
    return defaultTheme;
  });

  /**
   * Apply CSS variables to document root when theme changes
   */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--success-color', theme.successColor);
    root.style.setProperty('--error-color', theme.errorColor);
    root.style.setProperty('--warning-color', theme.warningColor);
    root.style.setProperty('--info-color', theme.infoColor);
    root.style.setProperty('--border-radius', theme.borderRadius);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--font-size-small', theme.fontSize.small);
    root.style.setProperty('--font-size-medium', theme.fontSize.medium);
    root.style.setProperty('--font-size-large', theme.fontSize.large);
    root.style.setProperty('--spacing-small', theme.spacing.small);
    root.style.setProperty('--spacing-medium', theme.spacing.medium);
    root.style.setProperty('--spacing-large', theme.spacing.large);

    // Apply background color to body
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;

    // Save to localStorage
    try {
      localStorage.setItem('appTheme', JSON.stringify(theme));
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }
  }, [theme]);

  /**
   * setTheme: Update theme state
   */
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  /**
   * importTheme: Parses a JSON string and updates the global theme state
   * @param jsonString - The JSON string representation of the theme object
   * @returns boolean - true if import successful, false otherwise
   */
  const importTheme = useCallback((jsonString: string): boolean => {
    try {
      const newTheme = JSON.parse(jsonString);
      
      // Basic validation: ensure the parsed object is a valid theme structure
      if (newTheme && typeof newTheme.primaryColor === 'string') {
        setThemeState((prevTheme) => ({
          ...prevTheme,
          ...newTheme, // Merge imported properties
        }));
        return true;
      }
      
      console.error('Imported JSON is not a valid theme structure.');
      return false;
    } catch (e) {
      console.error('Error parsing theme JSON:', e);
      return false;
    }
  }, []);

  const value: ThemeContextValue = {
    theme,
    setTheme,
    importTheme,
    currentThemeName: theme.name || 'Custom',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
