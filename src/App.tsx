// import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './core/context/AuthContext';
import { ThemeProvider } from './core/theme';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import { useAppShortcuts } from './core/hooks/useAppShortcuts';
import { Dashboard } from './core/Dashboard';
import { UserManagementComponent } from './features/users/UserManagement';
import { TranslationManagement } from './features/settings/TranslationManagement';
import { KeyboardShortcutManagement } from './features/settings/KeyboardShortcutManagement';
import { ThemeBuilder } from './core/theme';
import Login from './features/auth/Login';


function AppContent() {
  // Initialize app-wide keyboard shortcuts
  useAppShortcuts();

  // Sync document direction based on current i18n language and listen for changes
  const { i18n } = useTranslation();
  useEffect(() => {
    const setDir = (lang: string) => {
      const dir = lang && lang.split('-')[0] === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = lang || 'en';
    };

    // set on mount
    setDir(i18n.language || 'en');

    // listen for language changes
    const handle = (lng: string) => setDir(lng);
    i18n.on && i18n.on('languageChanged', handle);
    return () => {
      i18n.off && i18n.off('languageChanged', handle);
    };
  }, [i18n]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagementComponent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/translations"
        element={
          <ProtectedRoute>
            <TranslationManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shortcuts"
        element={
          <ProtectedRoute>
            <KeyboardShortcutManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/theme"
        element={
          <ProtectedRoute>
            <ThemeBuilder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
