import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme';
import { themePresets } from '../theme/types';

/**
 * App-wide keyboard shortcuts
 * Ctrl+L: Change language
 * Ctrl+S: Login/Submit form
 * Ctrl+K: Cycle through themes
 */
export function useAppShortcuts() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+L: Change language
      if (event.ctrlKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        
        // Cycle through languages
        const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'ur'];
        const currentLang = i18n.language.split('-')[0];
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex];
        
        i18n.changeLanguage(nextLang);
        console.log(`✅ Language changed to: ${nextLang}`);
        
        // Show toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4CAF50;
          color: white;
          padding: 12px 20px;
          borderRadius: 6px;
          fontSize: 14px;
          fontWeight: 600;
          zIndex: 10000;
          animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = `🌐 Language: ${nextLang.toUpperCase()}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.animation = 'slideOutRight 0.3s ease-out';
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      }

      // Ctrl+S: Login or submit form — on login page also cycle language for form data
      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();

        const path = window.location.pathname || '';

        // If we're on the login page, change language first so form text updates,
        // then submit the form if present.
        if (path === '/login') {
          try {
            const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'ur'];
            const cur = (i18n?.language || 'en').split('-')[0];
            const next = languages[(languages.indexOf(cur) + 1) % languages.length];
            i18n.changeLanguage(next);
            console.log(`✅ (Login) Language changed to: ${next}`);

            const toast = document.createElement('div');
            toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 10px 14px; border-radius: 6px; z-index: 10000; font-weight: 600;';
            toast.textContent = `🌐 Language: ${next.toUpperCase()}`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 1600);
          } catch (err) {
            console.warn('Failed to change language on Ctrl+S', err);
          }
        }

        // Find and submit any visible form on the page
        const form = document.querySelector('form') as HTMLFormElement | null;
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
          if (submitButton) {
            submitButton.click();
            console.log('✅ Form submitted via Ctrl+S');
          } else {
            form.submit();
            console.log('✅ Form submitted via Ctrl+S');
          }
          return;
        }

        // If no form found, and user not authenticated, navigate to login
        if (!isAuthenticated) {
          navigate('/login');
          console.log('✅ Navigated to login via Ctrl+S');
        }
      }

      // Ctrl+K: Cycle through themes
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        
        const currentThemeName = theme.name || 'Light';
        const currentIndex = themePresets.findIndex(t => t.name === currentThemeName);
        const nextIndex = (currentIndex + 1) % themePresets.length;
        const nextTheme = themePresets[nextIndex];
        
        setTheme(nextTheme);
        console.log(`✅ Theme changed to: ${nextTheme.name}`);
        
        // Show toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${nextTheme.primaryColor};
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          z-index: 10000;
          animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = `🎨 Theme: ${nextTheme.name}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.animation = 'slideOutRight 0.3s ease-out';
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [i18n, navigate, isAuthenticated, theme, setTheme]);
}
