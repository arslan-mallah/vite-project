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

  const FeatureCard: React.FC<{ to: string; icon: string; title: string; desc: string; color: string }> = ({ to, icon, title, desc, color }) => (
    <Link to={to} className="group block h-full">
      <div className={`relative h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${color} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`}></div>
        <div className={`inline-flex items-center justify-center w-14 h-14 ${color} bg-opacity-10 rounded-xl mb-4 group-hover:bg-opacity-20 transition`} style={{ backgroundColor: `${color}20` }}>
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        <div className="mt-4 flex items-center text-sm font-semibold text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 transition">
          {t('dashboard.explore', 'Explore')} →
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                <span className="text-xl font-bold text-white">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t('app.name')}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-700">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  aria-haspopup="true"
                  aria-expanded={showMenu}
                >
                  <span className="text-xl">⋯</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition flex items-center gap-2"
                    >
                      <span>🚪</span> {t('dashboard.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3">
              {t('dashboard.welcome', 'Welcome to Dashboard')}
            </h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            to="/translations"
            icon="🌐"
            title={t('navigation.languageSettings')}
            desc={t('navigation.languageSettingsDesc')}
            color="bg-blue-500"
          />
          <FeatureCard
            to="/users"
            icon="👥"
            title={t('navigation.userManagement')}
            desc={t('navigation.userManagementDesc')}
            color="bg-green-500"
          />
          <FeatureCard
            to="/shortcuts"
            icon="⌨️"
            title={t('navigation.keyboardShortcuts')}
            desc={t('navigation.keyboardShortcutsDesc')}
            color="bg-orange-500"
          />
          <FeatureCard
            to="/theme"
            icon="🎨"
            title={t('navigation.themeBuilder')}
            desc={t('navigation.themeBuilderDesc')}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Tips Section */}
        <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>💡</span> {t('dashboard.tips', 'Quick Tips')}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-lg mt-0.5">⌨️</span>
              <span><strong>Ctrl+L</strong> — {t('dashboard.tipsLanguage', 'Change language')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg mt-0.5">⌨️</span>
              <span><strong>Ctrl+K</strong> — {t('dashboard.tipsTheme', 'Cycle themes')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg mt-0.5">⌨️</span>
              <span><strong>Ctrl+S</strong> — {t('dashboard.tipsSubmit', 'Quick submit')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg mt-0.5">🌍</span>
              <span>{t('dashboard.tips13Languages', '13 languages supported')}</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
