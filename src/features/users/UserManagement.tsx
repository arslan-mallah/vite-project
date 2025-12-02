import { useState } from 'react';
import { userService } from '../../core/services/example.service';
import { PageWrapper } from '../../core/components/PageWrapper';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * User Management Component - HTTP Service Testing
 */
export function UserManagementComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  // Fetch all users
  const handleGetAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      console.log('Users fetched:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const newUser = await userService.createUser(formData);
      setUsers([...users, newUser]);
      setFormData({ name: '', email: '', role: 'user' });
      console.log('User created:', newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    setLoading(true);
    setError('');
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      console.log('User deleted:', userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper 
      title="👥 User Management" 
      subtitle="Manage system users, roles, and permissions"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 animate-pulse">Loading...</p>
        </div>
      )}

      {/* Fetch Users Button */}
      <div className="mb-8">
        <button 
          onClick={handleGetAllUsers}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Fetch All Users
        </button>
      </div>

      {/* Create User Form */}
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">➕ Create New User</h3>
        <form onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter user name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Create User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          📋 Users List ({users.length})
        </h3>

        {users.length === 0 ? (
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
            <p className="text-slate-500 dark:text-slate-400">
              No users found. Click "Fetch All Users" to load.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div 
                key={user.id}
                className="bg-white dark:bg-slate-800 border-l-4 border-l-blue-500 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {user.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    {user.email}
                  </p>
                  <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded">
                    {user.role}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {user.id}
                  </span>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded transition-all transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
