import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';

export function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: 40, textAlign: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <header style={{ width: '100%', marginBottom: 24 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>🚀 {t('app.name')}</div>
            <div style={{ color: '#666', fontSize: 14 }}>{t('dashboard.subtitle')}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12, borderRight: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 18 }}>{user.avatar}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{user.username}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{user.email}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 20,
                border: 'none',
                background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                fontSize: 18,
              }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)')}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
            >
              👤
            </button>

            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 45,
                  right: 0,
                  background: 'white',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: 160,
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    color: '#d32f2f',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ffebee')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  🚪 {t('dashboard.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <h1 style={{ fontSize: 48, marginBottom: 10 }}>{t('dashboard.title')}</h1>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 40 }}>{t('dashboard.subtitle')}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
        {/* Language Settings */}
        <Link to="/translations" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: 30,
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s, boxShadow 0.3s',
              border: '1px solid #e0e0e0',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌐</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>{t('navigation.languageSettings')}</h3>
            <p style={{ color: '#666', fontSize: 14 }}>{t('navigation.languageSettingsDesc')}</p>
          </div>
        </Link>

        {/* User Management */}
        <Link to="/users" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: 30,
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s, boxShadow 0.3s',
              border: '1px solid #e0e0e0',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>{t('navigation.userManagement')}</h3>
            <p style={{ color: '#666', fontSize: 14 }}>{t('navigation.userManagementDesc')}</p>
          </div>
        </Link>

        {/* Keyboard Shortcuts */}
        <Link to="/shortcuts" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: 30,
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s, boxShadow 0.3s',
              border: '1px solid #e0e0e0',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>⌨️</div>
            <h3 style={{ margin: '10px 0', color: '#333' }}>{t('navigation.keyboardShortcuts')}</h3>
            <p style={{ color: '#666', fontSize: 14 }}>{t('navigation.keyboardShortcutsDesc')}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
