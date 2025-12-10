import { Link } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';

export function MenuList() {
  const { isAuthenticated } = useAuth();

  const menus = [
    { id: 1, name: 'Dashboard', url: '/dashboard', icon: '📊' },
    { id: 2, name: 'Settings', url: '/menu-management', icon: '⚙️' },
    { id: 3, name: 'Inventory', url: '/inventory', icon: '📦' },
    { id: 4, name: 'Theme Builder', url: '/theme', icon: '🎨' },
    { id: 5, name: 'Shortcut Keys', url: '/shortcuts', icon: '⌨️' },
    { id: 6, name: 'User Management', url: '/users', icon: '👥' },
    { id: 7, name: 'Language Translator', url: '/translations', icon: '🌐' },
    { id: 8, name: 'Companies', url: '/companies', icon: '🏢' },
    { id: 9, name: 'Branches', url: '/branches', icon: '🏪' },
  ];

  const MenuCard: React.FC<{ menu: { id: number; name: string; url: string; icon: string }, isAuthenticated: boolean }> = ({ menu, isAuthenticated }) => {
    const linkUrl = menu.url === '/dashboard' && !isAuthenticated ? '/login' : menu.url;
    return (
      <Link to={linkUrl} className="group block h-full">
        <div className="relative h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 bg-opacity-10 rounded-xl mb-4 group-hover:bg-opacity-20 transition">
            <span className="text-3xl">{menu.icon}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{menu.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Navigate to {menu.name.toLowerCase()}
          </p>
          <div className="mt-4 flex items-center text-sm font-semibold text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 transition">
            Access →
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
            Navigation Menu
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Explore and manage your application menus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map(menu => <MenuCard key={menu.id} menu={menu} isAuthenticated={isAuthenticated} />)}
        </div>
      </div>
    </div>
  );
}
