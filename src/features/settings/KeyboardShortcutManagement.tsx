import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { KeyboardShortcut } from '../../core/services/keyboard-shortcut.service';
import { keyboardShortcutService } from '../../core/services/keyboard-shortcut.service';
import { PageWrapper } from '../../core/components/PageWrapper';

export function KeyboardShortcutManagement() {
  const { t } = useTranslation();
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [newShortcut, setNewShortcut] = useState({
    id: '',
    name: '',
    keys: [] as string[],
    description: '',
    category: 'custom' as 'navigation' | 'editing' | 'global' | 'custom',
  });

  const loadShortcuts = () => {
    setLoading(true);
    setTimeout(() => {
      const allShortcuts = keyboardShortcutService.getAll();
      setShortcuts(allShortcuts);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Initialize keyboard shortcut service
    keyboardShortcutService.init();
    
    // Load shortcuts
    loadShortcuts();

    return () => {
      keyboardShortcutService.destroy();
    };
  }, []);

  const handleAddShortcut = () => {
    if (!newShortcut.id || !newShortcut.name || newShortcut.keys.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    keyboardShortcutService.register({
      id: newShortcut.id,
      name: newShortcut.name,
      keys: newShortcut.keys,
      description: newShortcut.description,
      action: () => console.log(`${newShortcut.name} shortcut triggered`),
      enabled: true,
      category: newShortcut.category,
    });

    setNewShortcut({
      id: '',
      name: '',
      keys: [],
      description: '',
      category: 'custom',
    });

    loadShortcuts();
  };

  const handleDeleteShortcut = (shortcutId: string) => {
    keyboardShortcutService.unregister(shortcutId);
    loadShortcuts();
  };

  const handleToggleShortcut = (shortcutId: string) => {
    const shortcut = keyboardShortcutService.get(shortcutId);
    if (shortcut) {
      if (shortcut.enabled) {
        keyboardShortcutService.disable(shortcutId);
      } else {
        keyboardShortcutService.enable(shortcutId);
      }
      loadShortcuts();
    }
  };

  const handleKeyCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const keys: string[] = [];

    if (e.ctrlKey) keys.push('ctrl');
    if (e.shiftKey) keys.push('shift');
    if (e.altKey) keys.push('alt');
    if (e.metaKey) keys.push('meta');

    keys.push(e.key.toUpperCase());

    setNewShortcut({
      ...newShortcut,
      keys,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      navigation: 'from-green-500 to-green-600',
      editing: 'from-blue-500 to-blue-600',
      global: 'from-orange-500 to-orange-600',
      custom: 'from-purple-500 to-purple-600',
    };
    return colors[category] || 'from-slate-500 to-slate-600';
  };

  if (loading) {
    return (
      <PageWrapper title="⌨️ Keyboard Shortcuts">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-300 animate-pulse">{t('users.loading')}</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="⌨️ Keyboard Shortcuts" 
      subtitle={t('shortcuts.desc')}
    >
      {/* Add New Shortcut Section */}
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          ➕ {t('shortcuts.createNew')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('shortcuts.idLabel')}
            </label>
            <input
              type="text"
              placeholder={t('shortcuts.idPlaceholder')}
              value={newShortcut.id}
              onChange={(e) => setNewShortcut({ ...newShortcut, id: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('shortcuts.nameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('shortcuts.namePlaceholder')}
              value={newShortcut.name}
              onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('shortcuts.pressKeysLabel')}
            </label>
            <input
              type="text"
              placeholder={t('shortcuts.pressKeysPlaceholder')}
              value={newShortcut.keys.length > 0 ? keyboardShortcutService.formatShortcut(newShortcut.keys) : ''}
              onKeyDown={handleKeyCapture}
              readOnly
              className="w-full px-4 py-2 border-2 border-blue-400 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('shortcuts.categoryLabel')}
            </label>
            <select
              value={newShortcut.category}
              onChange={(e) =>
                setNewShortcut({
                  ...newShortcut,
                  category: e.target.value as 'navigation' | 'editing' | 'global' | 'custom',
                })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="custom">{t('shortcuts.category.custom')}</option>
              <option value="navigation">{t('shortcuts.category.navigation')}</option>
              <option value="editing">{t('shortcuts.category.editing')}</option>
              <option value="global">{t('shortcuts.category.global')}</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('shortcuts.descriptionLabel')}
            </label>
            <textarea
              placeholder={t('shortcuts.descriptionPlaceholder')}
              value={newShortcut.description}
              onChange={(e) => setNewShortcut({ ...newShortcut, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleAddShortcut}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {t('shortcuts.addButton')}
        </button>
      </div>

      {/* Shortcuts List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          📋 {t('shortcuts.allShortcuts', { count: shortcuts.length })}
        </h3>

        {shortcuts.length === 0 ? (
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-slate-500 dark:text-slate-400">{t('shortcuts.noShortcuts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className={`bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border-l-4 border-l-${getCategoryColor(shortcut.category).split(' ')[0]}`}
              >
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {shortcut.name}
                  </h4>
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoryColor(shortcut.category)} text-white text-xs font-bold rounded`}>
                    {t(`shortcuts.category.${shortcut.category}`) || shortcut.category}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded font-mono text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {keyboardShortcutService.formatShortcut(shortcut.keys)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {shortcut.description}
                  </p>
                </div>

                <div className="mb-4 space-y-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{shortcut.id}</code>
                  </p>
                  <p className={`text-xs font-semibold ${shortcut.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {shortcut.enabled ? `✅ ${t('shortcuts.enabled')}` : `❌ ${t('shortcuts.disabled')}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleShortcut(shortcut.id)}
                    className={`flex-1 py-2 px-3 rounded font-semibold text-white text-sm transition-all ${
                      shortcut.enabled
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {shortcut.enabled ? t('shortcuts.disable') : t('shortcuts.enable')}
                  </button>

                  <button
                    onClick={() => handleDeleteShortcut(shortcut.id)}
                    className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition-all"
                  >
                    {t('shortcuts.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-6 text-center text-white shadow-md">
          <h3 className="text-sm font-semibold mb-2">{t('shortcuts.totalShortcuts')}</h3>
          <p className="text-4xl font-bold">{shortcuts.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg p-6 text-center text-white shadow-md">
          <h3 className="text-sm font-semibold mb-2">{t('shortcuts.enabled')}</h3>
          <p className="text-4xl font-bold">{shortcuts.filter((s) => s.enabled).length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg p-6 text-center text-white shadow-md">
          <h3 className="text-sm font-semibold mb-2">{t('shortcuts.disabled')}</h3>
          <p className="text-4xl font-bold">{shortcuts.filter((s) => !s.enabled).length}</p>
        </div>
      </div>
    </PageWrapper>
  );
}
