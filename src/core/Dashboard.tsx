import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: 40, textAlign: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
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
            <h3 style={{ margin: '10px 0', color: '#333' }}>Keyboard Shortcuts</h3>
            <p style={{ color: '#666', fontSize: 14 }}>Create and manage keyboard shortcuts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
