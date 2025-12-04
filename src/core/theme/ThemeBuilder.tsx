import React, { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeContext';
import { themePresets } from './types';
import type { Theme } from './types';
import { PageWrapper } from '../components/PageWrapper';

/**
 * ThemeBuilder Component
 * Allows users to customize, copy, and import themes
 */
export const ThemeBuilder: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme, currentThemeName } = useTheme();
  const [copyStatus, setCopyStatus] = useState<string>('');
  const initialThemeRef = useRef(theme);

  /**
   * handleColorChange: Updates a specific color in the theme
   */
  const handleColorChange = useCallback((key: keyof Omit<Theme, 'fontSize' | 'spacing' | 'name'>, value: string) => {
    setTheme({
      ...theme,
      [key]: value,
    });
  }, [theme, setTheme]);

  // Keep a couple of small user-friendly helpers: reset and randomize
  const handleReset = useCallback(() => {
    setTheme(initialThemeRef.current);
    setCopyStatus('✨ Reset to original theme');
    setTimeout(() => setCopyStatus(''), 2000);
  }, [setTheme]);

  const handleRandomize = useCallback(() => {
    const randHex = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    const keys = [
      'primaryColor',
      'secondaryColor',
      'backgroundColor',
      'textColor',
      'borderColor',
      'successColor',
      'errorColor',
      'warningColor',
      'infoColor',
    ] as Array<keyof Omit<Theme, 'fontSize' | 'spacing' | 'name'>>;

    const newTheme = { ...theme } as any;
    keys.forEach((k) => {
      newTheme[k] = randHex();
    });
    setTheme(newTheme);
    setCopyStatus('✨ Randomized colors');
    setTimeout(() => setCopyStatus(''), 2000);
  }, [theme, setTheme]);

  /**
   * handleSelectPreset: Apply a preset theme
   */
  const handleSelectPreset = useCallback((preset: Theme) => {
    setTheme(preset);
    setCopyStatus(`✨ ${preset.name} ${t('theme.applied', 'applied')}!`);
    setTimeout(() => setCopyStatus(''), 2000);
  }, [setTheme, t]);

  const colorInputs = [
    { key: 'primaryColor', label: t('theme.primaryColor') },
    { key: 'secondaryColor', label: t('theme.secondaryColor') },
    { key: 'backgroundColor', label: t('theme.backgroundColor') },
    { key: 'textColor', label: t('theme.textColor') },
    { key: 'borderColor', label: t('theme.borderColor') },
    { key: 'successColor', label: t('theme.successColor') },
    { key: 'errorColor', label: t('theme.errorColor') },
    { key: 'warningColor', label: t('theme.warningColor') },
    { key: 'infoColor', label: t('theme.infoColor') },
  ] as const;

  const previewColors = [
    { label: 'Primary', color: theme.primaryColor },
    { label: 'Secondary', color: theme.secondaryColor },
    { label: 'Success', color: theme.successColor },
    { label: 'Error', color: theme.errorColor },
    { label: 'Warning', color: theme.warningColor },
    { label: 'Info', color: theme.infoColor },
  ];

  return (
    <PageWrapper 
      title="🎨 Theme Builder" 
      subtitle="Customize colors and create your perfect theme"
    >
      {/* Current Theme Display */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 p-6 rounded-lg mb-8">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {t('theme.currentTheme')}
        </p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">
          {currentThemeName}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 {t('theme.quickSwitch')}
        </p>
      </div>

      {/* Theme Presets */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('theme.presets')}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {themePresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset)}
              className={`group px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                currentThemeName === preset.name
                  ? 'scale-110 shadow-lg ring-2 ring-white'
                  : 'hover:scale-105 hover:shadow-md'
              }`}
              style={{
                backgroundColor: preset.primaryColor,
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-300 dark:border-slate-700 my-8" />

      {/* Color Picker Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('theme.customizeColors')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorInputs.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                {label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={(theme as any)[key]}
                  onChange={(e) => handleColorChange(key as any, e.target.value)}
                  className="w-14 h-12 border-2 border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                />
                <input
                  type="text"
                  value={(theme as any)[key]}
                  onChange={(e) => handleColorChange(key as any, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-slate-300 dark:border-slate-700 my-8" />

      {/* Theme Controls */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('theme.controls', 'Theme Controls')}
        </h3>

        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
          {t('theme.controlsDescription', 'Edit colors above — changes apply instantly. Use the buttons to reset or experiment.')}
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
          >
            🔄 {t('theme.reset', 'Reset')}
          </button>

          <button
            onClick={handleRandomize}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
          >
            🎲 {t('theme.randomize', 'Randomize Colors')}
          </button>

          {copyStatus && (
            <span className={`text-sm font-semibold ${
              copyStatus.includes('✅') || copyStatus.includes('✨')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {copyStatus}
            </span>
          )}
        </div>
      </div>

      <hr className="border-slate-300 dark:border-slate-700 my-8" />

      {/* Color Preview Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('theme.colorPreview')}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {previewColors.map(({ label, color }) => (
            <div
              key={label}
              className="rounded-lg p-6 text-white text-center font-semibold text-sm shadow-md hover:shadow-lg transition-shadow transform hover:scale-105"
              style={{
                backgroundColor: color,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ThemeBuilder;
