import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Menu {
  id: number;
  name: string;
  url?: string;
  icon?: string;
  parent_id?: number;
  order: number;
  active: boolean;
  children?: Menu[];
}

class MenuService {
  private baseUrl = '/menus';

  async getMenus(): Promise<Menu[]> {
    const response = await apiClient.get(this.baseUrl);
    return response.data.menus;
  }

  async createMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
    const response = await apiClient.post(this.baseUrl, menu);
    return response.data.menu;
  }

  async updateMenu(id: number, menu: Partial<Menu>): Promise<Menu> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, menu);
    return response.data.menu;
  }

  async deleteMenu(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async getMenu(id: number): Promise<Menu> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data.menu;
  }
}

export const menuService = new MenuService();
