/**
 * Authentication Service
 * Manages user authentication, tokens, and session persistence
 */

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

class AuthService {
  private listeners: Set<() => void> = new Set();

  /**
   * Mock user database
   */
  private mockUsers: Record<string, { password: string; user: User }> = {
    demo: {
      password: 'demo',
      user: {
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        avatar: '👤',
      },
    },
    admin: {
      password: 'admin123',
      user: {
        id: '2',
        username: 'admin',
        email: 'admin@example.com',
        avatar: '👨‍💼',
      },
    },
    user: {
      password: 'user123',
      user: {
        id: '3',
        username: 'user',
        email: 'user@example.com',
        avatar: '👨‍💻',
      },
    },
  };

  /**
   * Login user with username and password
   */
  public login(username: string, password: string): { success: boolean; error?: string; user?: User } {
    // Simulate network delay
    const mockUser = this.mockUsers[username.toLowerCase()];

    if (!mockUser) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (mockUser.password !== password) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Generate mock token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = mockUser.user;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // Notify listeners
    this.notifyListeners();

    return { success: true, user };
  }

  /**
   * Logout user
   */
  public logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.notifyListeners();
  }

  /**
   * Get current authentication state
   */
  public getAuthState(): AuthState {
    const token = localStorage.getItem(STORAGE_KEY);
    const userJson = localStorage.getItem(USER_STORAGE_KEY);

    if (!token || !userJson) {
      return { user: null, token: null, isAuthenticated: false };
    }

    try {
      const user = JSON.parse(userJson);
      return { user, token, isAuthenticated: true };
    } catch {
      return { user: null, token: null, isAuthenticated: false };
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEY);
    return !!token;
  }

  /**
   * Get current user
   */
  public getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Subscribe to auth state changes
   */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// Export singleton instance
export const authService = new AuthService();
