
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './core/Dashboard';
import { UserManagementComponent } from './features/users/UserManagement';
import { TranslationManagement } from './features/settings/TranslationManagement';
import { KeyboardShortcutManagement } from './features/settings/KeyboardShortcutManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagementComponent />} />
        <Route path="/translations" element={<TranslationManagement />} />
        <Route path="/shortcuts" element={<KeyboardShortcutManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
