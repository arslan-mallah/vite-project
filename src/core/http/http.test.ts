/**
 * Test examples for HTTP Service
 * Run these in your component or test file
 */

import { userService, companyService } from '../services/example.service';
import { httpService } from '../http/abi-http.service';

/**
 * Test 1: Direct HTTP Service Usage
 */
export async function testHttpService() {
  try {
    console.log('=== Testing HTTP Service ===');

    // GET request
    const users = await httpService.get('/users');
    console.log('GET /users:', users);

    // POST request
    const newUser = await httpService.post('/users', {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    });
    console.log('POST /users:', newUser);

    // PUT request
    const updated = await httpService.put('/users/1', {
      name: 'Jane Doe',
    });
    console.log('PUT /users/1:', updated);

    // DELETE request
    const deleted = await httpService.delete('/users/1');
    console.log('DELETE /users/1:', deleted);
  } catch (error) {
    console.error('HTTP Service Error:', error);
  }
}

/**
 * Test 2: User Service
 */
export async function testUserService() {
  try {
    console.log('=== Testing User Service ===');

    // Get all users
    const allUsers = await userService.getAllUsers();
    console.log('All Users:', allUsers);

    // Get single user
    const singleUser = await userService.getUserById(1);
    console.log('User by ID:', singleUser);

    // Create user
    const createdUser = await userService.createUser({
      name: 'Alice Smith',
      email: 'alice@example.com',
      role: 'user',
    });
    console.log('Created User:', createdUser);

    // Update user
    const updatedUser = await userService.updateUser(1, {
      name: 'Alice Updated',
    });
    console.log('Updated User:', updatedUser);

    // Delete user
    await userService.deleteUser(1);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('User Service Error:', error);
  }
}

/**
 * Test 3: Company Service
 */
export async function testCompanyService() {
  try {
    console.log('=== Testing Company Service ===');

    // Get all companies
    const allCompanies = await companyService.getAllCompanies();
    console.log('All Companies:', allCompanies);

    // Create company
    const newCompany = await companyService.createCompany({
      name: 'Tech Corp',
      email: 'info@techcorp.com',
      phone: '1234567890',
    });
    console.log('Created Company:', newCompany);

    // Update company
    const updatedCompany = await companyService.updateCompany(1, {
      name: 'Tech Corp Updated',
    });
    console.log('Updated Company:', updatedCompany);

    // Delete company
    await companyService.deleteCompany(1);
    console.log('Company deleted successfully');
  } catch (error) {
    console.error('Company Service Error:', error);
  }
}

/**
 * Test 4: Auth Token Management
 */
export function testAuthToken() {
  console.log('=== Testing Auth Token ===');

  // Set token
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  localStorage.setItem('authToken', mockToken);
  console.log('Token set:', mockToken);

  // Token will be auto-added to all requests
  console.log('Auth token will be included in all HTTP requests');
}
