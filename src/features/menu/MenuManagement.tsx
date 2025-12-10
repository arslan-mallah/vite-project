import { useEffect, useState } from 'react';
import { menuService, type Menu } from '../../core/services/menu.service';

export function MenuManagement() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    parent_id: '',
    order: 0,
    active: true,
  });

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await menuService.getMenus();
      setMenus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const menuData = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : undefined,
      };

      if (editingMenu) {
        await menuService.updateMenu(editingMenu.id, menuData);
      } else {
        await menuService.createMenu(menuData);
      }

      setFormData({ name: '', url: '', icon: '', parent_id: '', order: 0, active: true });
      setEditingMenu(null);
      loadMenus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      url: menu.url || '',
      icon: menu.icon || '',
      parent_id: menu.parent_id?.toString() || '',
      order: menu.order,
      active: menu.active,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      try {
        await menuService.deleteMenu(id);
        loadMenus();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const flattenMenus = (menus: Menu[]): Menu[] => {
    const result: Menu[] = [];
    const traverse = (items: Menu[]) => {
      items.forEach(item => {
        result.push(item);
        if (item.children) traverse(item.children);
      });
    };
    traverse(menus);
    return result;
  };

  const flatMenus = flattenMenus(menus);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
            Menu Management
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Create and manage your application navigation menus
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {editingMenu ? 'Edit Menu' : 'Add New Menu'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., 📁"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Parent Menu</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">None (Root Level)</option>
                  {flatMenus.map(menu => (
                    <option key={menu.id} value={menu.id.toString()}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Active</label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {editingMenu ? 'Update' : 'Create'}
              </button>
              {editingMenu && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMenu(null);
                    setFormData({ name: '', url: '', icon: '', parent_id: '', order: 0, active: true });
                  }}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Menu List */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Menus</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 bg-opacity-10 rounded-full mb-4">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map(menu => (
                <div key={menu.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {menu.icon && <span className="text-2xl">{menu.icon}</span>}
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{menu.name}</h3>
                        {menu.url && <p className="text-sm text-slate-500 dark:text-slate-400">({menu.url})</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {menu.children && menu.children.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Submenus:</p>
                      <div className="space-y-1">
                        {menu.children.map(child => (
                          <div key={child.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{child.icon} {child.name}</span>
                            <span className="text-slate-500 dark:text-slate-500">{child.url}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
