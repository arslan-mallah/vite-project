import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Management from '../features/dashboard/Management';
import Customers from '../features/dashboard/Customers';
import Sales from '../features/dashboard/Sales';
import Inventory from '../features/dashboard/Inventory';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (pathname: string) => {
    if (pathname === '/dashboard' || pathname === '/') return 'management';
    // if (pathname === '/customers') return 'customers';
    if (pathname.startsWith('/customers')) return 'customers';
    if (pathname === '/works') return 'works';
    if (pathname === '/sales') return 'sales';
    if (pathname.startsWith('/inventory')) return 'inventory';
    if (pathname === '/hr') return 'hr';
    if (pathname === '/reports') return 'reports';
    if (pathname === '/training') return 'training';
    if (pathname === '/website') return 'website';
    return 'management'; // default
  };

  const activeTab = getActiveTab(location.pathname);

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

  const handleTabClick = (tab: string) => {
    const routeMap: { [key: string]: string } = {
      'Management': '/dashboard',
      'Customers': '/customers',
      'Works': '/works',
      'Sales': '/sales',
      'Inventory': '/inventory',
      'HR': '/hr',
      'Reports': '/reports',
      'Training': '/training',
      'Website': '/website',
    };
    const route = routeMap[tab] || '/dashboard';
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="">

      {/* Header */}
      <header className="bg-white  sticky top-0 z-40 shadow w-full">
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
            <div className="flex gap-1 overflow-x-auto flex-1 mx-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`border-2 border-zinc-500 px-1 py-1 font-semibold text-sm whitespace-nowrap transition-all duration-300 w-24 h-9
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
              {/* {user && (
                <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-700">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.name}</p>
                  </div>
                </div>
              )} */}

              <button
                type="button"
                // onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center w-24 h-9 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                title="Refresh"
              >
                <span className="text-sm font-semibold">Refresh</span>
              </button>


              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center w-24 h-9 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                title="Logout"
              >
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}

      {activeTab === 'management' && <Management />}
      {activeTab === 'customers' && <Customers />}
      {activeTab === 'sales' && <Sales />}
      {activeTab === 'inventory' && <Inventory />}
      {activeTab !== 'management' && activeTab !== 'customers' && activeTab !== 'sales' && activeTab !== 'inventory' && (
        <div className="w-full min-h-screen bg-white p-4 flex justify-center items-center text-gray-400 text-lg font-semibold">
          No Data Available for {activeTab}
        </div>
      )}

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
