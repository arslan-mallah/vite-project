import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './core/context/AuthContext';
import { ThemeProvider } from './core/theme';
import { UserRouteGuard } from './core/gaurds';
import { useAppShortcuts } from './core/hooks/useAppShortcuts';
import { Dashboard } from './core/Dashboard';
import { UserManagementComponent } from './features/users/UserManagement';
import { TranslationManagement } from './features/settings/TranslationManagement';
import { KeyboardShortcutManagement } from './features/settings/KeyboardShortcutManagement';
import { ThemeBuilder } from './core/theme';
import Login from './features/auth/Login';
import { Inventory } from './features/inventory/Inventory';
import { CompanyManagement } from './features/companies/CompanyManagement';
import { BranchManagement } from './features/branches/BranchManagement';

// Optional: Not Found Page
const NotFound = () => <div className="flex items-center justify-center w-screen h-screen">
      <div className="text-4xl font-bold text-center">
        404 - Page Not Found
      </div>
    </div>;

function AppContent() {
  // Initialize app-wide keyboard shortcuts
  useAppShortcuts();

  // Sync document direction based on current i18n language
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
    i18n.on?.('languageChanged', handle);
    return () => {
      i18n.off?.('languageChanged', handle);
    };
  }, [i18n]);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/users"
        element={
          <UserRouteGuard>
            <UserManagementComponent />
          </UserRouteGuard>
        }
      />
      <Route
        path="/translations"
        element={
          <UserRouteGuard>
            <TranslationManagement />
          </UserRouteGuard>
        }
      />
      <Route
        path="/shortcuts"
        element={
          <UserRouteGuard>
            <KeyboardShortcutManagement />
          </UserRouteGuard>
        }
      />
      <Route
        path="/theme"
        element={
          <UserRouteGuard>
            <ThemeBuilder />
          </UserRouteGuard>
        }
      />
      <Route
        path="/inventory"
        element={
          <UserRouteGuard>
            <Inventory />
          </UserRouteGuard>
        }
      />
      <Route
        path="/companies"
        element={
          <UserRouteGuard>
            <CompanyManagement />
          </UserRouteGuard>
        }
      />
      <Route
        path="/branches"
        element={
          <UserRouteGuard>
            <BranchManagement />
          </UserRouteGuard>
        }
      />
      <Route
        path="/customers/*"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/works"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/sales"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/hr"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/reports"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/training"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      <Route
        path="/website"
        element={
          <UserRouteGuard>
            <Dashboard />
          </UserRouteGuard>
        }
      />
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
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
