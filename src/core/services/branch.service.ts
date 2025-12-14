import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-tenant-domain'] = import.meta.env.VITE_TENANT_DOMAIN || 'localhost';
  return config;
});

export interface Branch {
  id: string;
  name: string;
  company_id: string;
  address?: string;
  phone?: string;
  email?: string;
  active: boolean;
}

class BranchService {
  private baseUrl = '/branches';

  async getBranches(): Promise<Branch[]> {
    const response = await apiClient.get(this.baseUrl);
    return response.data.branches;
  }

  async createBranch(branch: Omit<Branch, 'id'>): Promise<Branch> {
    const response = await apiClient.post(this.baseUrl, branch);
    return response.data.branch;
  }

  async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, branch);
    return response.data.branch;
  }

  async deleteBranch(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export default new BranchService();
