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

export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  active: boolean;
}

class CompanyService {
  private baseUrl = '/companies';

  async getCompanies(): Promise<Company[]> {
    const response = await apiClient.get(this.baseUrl);
    return response.data.companies;
  }

  async createCompany(company: Omit<Company, 'id'>): Promise<Company> {
    const response = await apiClient.post(this.baseUrl, company);
    return response.data.company;
  }

  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, company);
    return response.data.company;
  }

  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export default new CompanyService();
