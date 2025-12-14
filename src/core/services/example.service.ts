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
  id: string;
  name: string;
  cr_number?: string;
  cr_issue_date?: string;
  email?: string;
  phone?: string;
}

export class CompanyService {
  private endpoint = '/companies';

  async getAllCompanies(): Promise<Company[]> {
    return httpService.get<Company[]>(this.endpoint);
  }

  async getCompanyById(id: string): Promise<Company> {
    return httpService.get<Company>(`${this.endpoint}/${id}`);
  }

  async createCompany(payload: Omit<Company, 'id'>): Promise<Company> {
    return httpService.post<Company>(this.endpoint, payload);
  }

  async updateCompany(id: string, payload: Partial<Company>): Promise<Company> {
    return httpService.put<Company>(`${this.endpoint}/${id}`, payload);
  }

  async deleteCompany(id: string): Promise<void> {
    return httpService.delete<void>(`${this.endpoint}/${id}`);
  }
}

export const companyService = new CompanyService();

/**
 * Example: Branch Service using HTTP Service
 */

interface Branch {
  id: string;
  company_id: string;
  name: string;
  code: string;
  city?: string;
  is_main: boolean;
}

export class BranchService {
  private endpoint = '/branches';

  async getAllBranches(): Promise<Branch[]> {
    return httpService.get<Branch[]>(this.endpoint);
  }

  async getBranchById(id: string): Promise<Branch> {
    return httpService.get<Branch>(`${this.endpoint}/${id}`);
  }

  async createBranch(payload: Omit<Branch, 'id'>): Promise<Branch> {
    return httpService.post<Branch>(this.endpoint, payload);
  }

  async updateBranch(id: string, payload: Partial<Branch>): Promise<Branch> {
    return httpService.put<Branch>(`${this.endpoint}/${id}`, payload);
  }

  async deleteBranch(id: string): Promise<void> {
    return httpService.delete<void>(`${this.endpoint}/${id}`);
  }
}

export const branchService = new BranchService();
