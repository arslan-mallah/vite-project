// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
