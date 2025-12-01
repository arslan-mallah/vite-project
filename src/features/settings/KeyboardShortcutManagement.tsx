import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { KeyboardShortcut } from '../../core/services/keyboard-shortcut.service';
import { keyboardShortcutService } from '../../core/services/keyboard-shortcut.service';

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

  useEffect(() => {
    // Initialize keyboard shortcut service
    keyboardShortcutService.init();
    
    // Load shortcuts
    loadShortcuts();

    return () => {
      keyboardShortcutService.destroy();
    };
  }, []);

  const loadShortcuts = () => {
    setLoading(true);
    setTimeout(() => {
      const allShortcuts = keyboardShortcutService.getAll();
      setShortcuts(allShortcuts);
      setLoading(false);
    }, 500);
  };

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
      navigation: '#4CAF50',
      editing: '#2196F3',
      global: '#FF9800',
      custom: '#9C27B0',
    };
    return colors[category] || '#757575';
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>{t('users.loading')}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 10 }}>⌨️ {t('shortcuts.title')}</h1>
      <p style={{ fontSize: 16, color: '#666', marginBottom: 40 }}>
        {t('shortcuts.desc')}
      </p>

      {/* Add New Shortcut Section */}
      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: 20,
          borderRadius: 8,
          marginBottom: 40,
          border: '2px solid #e0e0e0',
        }}
      >
        <h3 style={{ marginTop: 0 }}>➕ {t('shortcuts.createNew')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              {t('shortcuts.idLabel')}
            </label>
            <input
              type="text"
              placeholder={t('shortcuts.idPlaceholder')}
              value={newShortcut.id}
              onChange={(e) => setNewShortcut({ ...newShortcut, id: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              {t('shortcuts.nameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('shortcuts.namePlaceholder')}
              value={newShortcut.name}
              onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
              {t('shortcuts.pressKeysLabel')}
            </label>
            <input
              type="text"
              placeholder={t('shortcuts.pressKeysPlaceholder')}
              value={newShortcut.keys.length > 0 ? keyboardShortcutService.formatShortcut(newShortcut.keys) : ''}
              onKeyDown={handleKeyCapture}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #2196F3',
                borderRadius: 4,
                fontSize: 14,
                backgroundColor: '#e3f2fd',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('shortcuts.categoryLabel')}</label>
            <select
              value={newShortcut.category}
              onChange={(e) =>
                setNewShortcut({
                  ...newShortcut,
                  category: e.target.value as 'navigation' | 'editing' | 'global' | 'custom',
                })
              }
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
              }}
            >
              <option value="custom">{t('shortcuts.category.custom')}</option>
              <option value="navigation">{t('shortcuts.category.navigation')}</option>
              <option value="editing">{t('shortcuts.category.editing')}</option>
              <option value="global">{t('shortcuts.category.global')}</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('shortcuts.descriptionLabel')}</label>
            <textarea
              placeholder={t('shortcuts.descriptionPlaceholder')}
              value={newShortcut.description}
              onChange={(e) => setNewShortcut({ ...newShortcut, description: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14,
                minHeight: 60,
                fontFamily: 'Arial',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleAddShortcut}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
        >
          {t('shortcuts.addButton')}
        </button>
      </div>

      {/* Shortcuts List */}
      <h3 style={{ marginBottom: 20 }}>📋 {t('shortcuts.allShortcuts', { count: shortcuts.length })}</h3>

      {shortcuts.length === 0 ? (
        <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ color: '#999' }}>{t('shortcuts.noShortcuts')}</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 15,
          }}
        >
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              style={{
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: `3px solid ${getCategoryColor(shortcut.category)}`,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{shortcut.name}</h4>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: getCategoryColor(shortcut.category),
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {t(`shortcuts.category.${shortcut.category}`) || shortcut.category}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#2196F3',
                    marginBottom: 8,
                  }}
                >
                  {keyboardShortcutService.formatShortcut(shortcut.keys)}
                </div>
                <p style={{ margin: '8px 0', color: '#666', fontSize: 14 }}>
                  {shortcut.description}
                </p>
              </div>

              <div style={{ marginBottom: 10 }}>
                <p style={{ margin: '5px 0', fontSize: 12, color: '#999' }}>
                  {t('shortcuts.idLabel')}: <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>{shortcut.id}</code>
                </p>
                <p style={{ margin: '5px 0', fontSize: 12, color: shortcut.enabled ? '#4CAF50' : '#F44336' }}>
                  {t('shortcuts.status')}: {shortcut.enabled ? `✅ ${t('shortcuts.enabled')}` : `❌ ${t('shortcuts.disabled')}`}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleToggleShortcut(shortcut.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: shortcut.enabled ? '#FF9800' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {shortcut.enabled ? t('shortcuts.disable') : t('shortcuts.enable')}
                </button>

                <button
                  onClick={() => handleDeleteShortcut(shortcut.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#F44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {t('shortcuts.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
        <div
          style={{
            padding: 20,
            backgroundColor: '#e3f2fd',
            borderRadius: 8,
            border: '2px solid #2196F3',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: 0, color: '#2196F3' }}>{t('shortcuts.totalShortcuts')}</h3>
          <p style={{ fontSize: 32, margin: '10px 0 0 0', fontWeight: 'bold', color: '#2196F3' }}>
            {shortcuts.length}
          </p>
        </div>

        <div
          style={{
            padding: 20,
            backgroundColor: '#c8e6c9',
            borderRadius: 8,
            border: '2px solid #4CAF50',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: 0, color: '#4CAF50' }}>{t('shortcuts.enabled')}</h3>
          <p style={{ fontSize: 32, margin: '10px 0 0 0', fontWeight: 'bold', color: '#4CAF50' }}>
            {shortcuts.filter((s) => s.enabled).length}
          </p>
        </div>

        <div
          style={{
            padding: 20,
            backgroundColor: '#ffccbc',
            borderRadius: 8,
            border: '2px solid #FF9800',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: 0, color: '#FF9800' }}>{t('shortcuts.disabled')}</h3>
          <p style={{ fontSize: 32, margin: '10px 0 0 0', fontWeight: 'bold', color: '#FF9800' }}>
            {shortcuts.filter((s) => !s.enabled).length}
          </p>
        </div>
      </div>
    </div>
  );
}
