import React, { useCallback, useState } from 'react';
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
  const { theme, setTheme, importTheme, currentThemeName } = useTheme();
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [importJson, setImportJson] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);

  /**
   * handleColorChange: Updates a specific color in the theme
   */
  const handleColorChange = useCallback((key: keyof Omit<Theme, 'fontSize' | 'spacing' | 'name'>, value: string) => {
    setTheme({
      ...theme,
      [key]: value,
    });
  }, [theme, setTheme]);

  /**
   * handleCopyTheme: Serializes the current theme object to JSON and copies to clipboard
   */
  const handleCopyTheme = useCallback(async () => {
    try {
      const themeJson = JSON.stringify(theme, null, 2);
      await navigator.clipboard.writeText(themeJson);
      setCopyStatus('✅ Copied!');
    } catch (err) {
      setCopyStatus('❌ Failed to copy.');
      console.error('Copy failed:', err);
    } finally {
      setTimeout(() => setCopyStatus(''), 2000);
    }
  }, [theme]);

  /**
   * handleImport: Imports theme from JSON string
   */
  const handleImport = useCallback(() => {
    if (importJson.trim()) {
      if (importTheme(importJson)) {
        setCopyStatus('✨ Theme Imported!');
        setImportJson('');
        setShowImport(false);
      } else {
        setCopyStatus('⚠️ Invalid JSON/Theme.');
      }
      setTimeout(() => setCopyStatus(''), 2000);
    }
  }, [importJson, importTheme]);

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

      {/* Export Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('theme.shareExport')}
        </h3>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyTheme}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
          >
            📋 {t('theme.copyThemeJson')}
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

      {/* Import Theme Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('theme.import')}
        </h3>
        
        <button
          onClick={() => setShowImport(!showImport)}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md mb-4"
        >
          {showImport ? '🔽' : '▶'} {t(showImport ? 'theme.hideImport' : 'theme.showImport')}
        </button>

        {showImport && (
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-lg">
            <textarea
              rows={8}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder={t('theme.pasteThemeJson', 'Paste theme JSON here')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
            />
            
            <button
              onClick={handleImport}
              className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
            >
              ✨ {t('theme.applyImported')}
            </button>
          </div>
        )}
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
