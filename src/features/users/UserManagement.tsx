import { useState } from 'react';
import { userService } from '../../core/services/example.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Example Component - HTTP Service Testing
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>User Management - HTTP Service Test</h1>

      {/* Error Display */}
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe0e0' }}>
          Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Fetch Users Button */}
      <button onClick={handleGetAllUsers} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Fetch All Users
      </button>

      {/* Create User Form */}
      <form onSubmit={handleCreateUser} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Create New User</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ padding: '8px', marginRight: '10px' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>
          Create User
        </button>
      </form>

      {/* Users List */}
      <div>
        <h3>Users List ({users.length})</h3>
        {users.length === 0 ? (
          <p>No users found. Click "Fetch All Users" to load.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
