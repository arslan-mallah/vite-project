import { httpService } from '../http/abi-http.service';

/**
 * Authentication Service
 * Manages user authentication, tokens, and session persistence
 */

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'authToken';
const USER_STORAGE_KEY = 'auth_user';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
  };
}

class AuthService {
  private listeners: Set<() => void> = new Set();

  /**
   * Login user with username and password via API
   */
  public async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const response = await httpService.post<LoginResponse>('/auth/login-tenant', { username, password });

      const { access_token, user } = response;

      // Store token and user
      localStorage.setItem(STORAGE_KEY, access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
        id: user.id,
        username: user.name,
        name: user.name,
        avatar: '👤',
      }));

      // Notify listeners
      this.notifyListeners();

      return { success: true, user: {
        id: user.id,
        username: user.name,
        name: user.name,
        avatar: '👤',
      }};
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage };
    }
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
