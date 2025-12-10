import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';
import Management from '../features/dashboard/Management';

export function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("management");

  const tabs = [
    "Website",
    "Management",
    "Customers",
    "Works",
    "Sales",
    "Inventory",
    "HR",
    "Reports",
    "Training",
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              {/* <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                <span className="text-xl font-bold text-white">🚀</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t('app.name')}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
              </div> */}
              
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto flex-1 mx-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`border-2 border-zinc-500 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300
                    ${activeTab === tab.toLowerCase()
                      ? "bg-black text-white shadow-lg border border-black"
                      : "bg-white text-black shadow hover:bg-gray-100 border border-gray-200"
                    }`}
                  style={{
                    boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-700">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.name}</p>
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

       <Management activeTab={activeTab} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        {/* <div className="mb-12">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3">
              {t('dashboard.welcome', 'Welcome to Dashboard')}
            </h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('dashboard.subtitle')}
          </p>
        </div> */}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature cards removed - now accessible via menu system */}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
