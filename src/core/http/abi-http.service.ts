/**
 * Simple HTTP Service using Fetch API
 */
export class AbiHttpService {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-tenant-domain': import.meta.env.VITE_TENANT_DOMAIN || 'app.carerp.io',
    };
    const token = localStorage.getItem('authToken');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    const response = await fetch(fullUrl, {
      headers: this.getHeaders(),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ success: false, message: `HTTP Error: ${response.status}` }));
      return errorData as T;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body: unknown): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

// Export singleton instance
export const httpService = new AbiHttpService(
  'http://localhost:8000/api'
);
