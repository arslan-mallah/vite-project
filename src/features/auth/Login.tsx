import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../core/context/AuthContext';

export function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Very small mock validation: accept any non-empty credentials
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    // Use auth service to login
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  // Local shortcut for Ctrl+L to change language (ensures it works on this page)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'ur'];
        const cur = (i18n?.language || 'en').split('-')[0];
        const idx = languages.indexOf(cur);
        const next = languages[(idx + 1) % languages.length];
        i18n.changeLanguage(next);

        const toast = document.createElement('div');
        toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 10px 14px; border-radius: 6px; z-index: 10000; font-weight: 600;';
        toast.textContent = `🌐 Language: ${next.toUpperCase()}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1600);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [i18n]);


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      margin: 0,
      padding: 0,
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 450,
        background: 'white',
        padding: 40,
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.6s ease-out',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 32, color: '#333', fontWeight: 700 }}>
            {t('auth.login', 'Welcome Back')}
          </h1>
          <p style={{ margin: 0, color: '#999', fontSize: 14 }}>
            {t('auth.loginSubtitle', 'Sign in to your account to continue')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333', fontSize: 14 }}>
              {t('auth.username', 'Username')}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('auth.usernamePlaceholder', 'Enter your username')}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '2px solid #e0e0e0',
                fontSize: 14,
                transition: 'all 0.3s ease',
                backgroundColor: isLoading ? '#f5f5f5' : 'white',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333', fontSize: 14 }}>
              {t('auth.password', 'Password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: 44,
                  borderRadius: 8,
                  border: '2px solid #e0e0e0',
                  fontSize: 14,
                  transition: 'all 0.3s ease',
                  backgroundColor: isLoading ? '#f5f5f5' : 'white',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#d32f2f',
              marginBottom: 16,
              padding: 12,
              backgroundColor: '#ffebee',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
            }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: 16,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              marginBottom: 12,
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
          >
            {isLoading ? '🔄 ' + t('auth.signingIn', 'Signing in...') : t('auth.signIn', 'Sign In')}
          </button>

          <button
            type="button"
            onClick={() => { setUsername(''); setPassword(''); setError(null); }}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#f5f5f5',
              color: '#333',
              border: 'none',
              borderRadius: 8,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#e8e8e8')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          >
            {t('auth.clear', 'Clear')}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #e0e0e0' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#999', fontWeight: 500 }}>
            📝 {t('auth.demoCredentials', 'Demo Credentials')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            <div style={{ padding: 8, backgroundColor: '#f9f9f9', borderRadius: 6, fontFamily: 'monospace' }}>
              <strong style={{ color: '#667eea' }}>demo</strong> / demo
            </div>
            <div style={{ padding: 8, backgroundColor: '#f9f9f9', borderRadius: 6, fontFamily: 'monospace' }}>
              <strong style={{ color: '#667eea' }}>admin</strong> / admin123
            </div>
            <div style={{ padding: 8, backgroundColor: '#f9f9f9', borderRadius: 6, fontFamily: 'monospace', gridColumn: '1 / -1' }}>
              <strong style={{ color: '#667eea' }}>user</strong> / user123
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;
