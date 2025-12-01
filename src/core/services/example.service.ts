import { httpService } from '../http/abi-http.service';

/**
 * Example: User Service using HTTP Service
 */

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
}

// User API endpoints
export class UserService {
  private endpoint = '/users';

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return httpService.get<User[]>(this.endpoint);
  }

  // Get single user by ID
  async getUserById(id: number): Promise<User> {
    return httpService.get<User>(`${this.endpoint}/${id}`);
  }

  // Create new user
  async createUser(payload: CreateUserPayload): Promise<User> {
    return httpService.post<User>(this.endpoint, payload);
  }

  // Update user
  async updateUser(id: number, payload: Partial<CreateUserPayload>): Promise<User> {
    return httpService.put<User>(`${this.endpoint}/${id}`, payload);
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    return httpService.delete<void>(`${this.endpoint}/${id}`);
  }
}

// Export service instance
export const userService = new UserService();

/**
 * Example: Company Service using HTTP Service
 */

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export class CompanyService {
  private endpoint = '/companies';

  async getAllCompanies(): Promise<Company[]> {
    return httpService.get<Company[]>(this.endpoint);
  }

  async getCompanyById(id: number): Promise<Company> {
    return httpService.get<Company>(`${this.endpoint}/${id}`);
  }

  async createCompany(payload: Omit<Company, 'id'>): Promise<Company> {
    return httpService.post<Company>(this.endpoint, payload);
  }

  async updateCompany(id: number, payload: Partial<Company>): Promise<Company> {
    return httpService.put<Company>(`${this.endpoint}/${id}`, payload);
  }

  async deleteCompany(id: number): Promise<void> {
    return httpService.delete<void>(`${this.endpoint}/${id}`);
  }
}

export const companyService = new CompanyService();
