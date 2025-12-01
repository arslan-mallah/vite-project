/**
 * COMPLETE FLOW EXPLANATION - How HTTP Service Works
 * 
 * Architecture:
 * 1. AbiHttpService (Core) - Base HTTP layer using Fetch API
 * 2. UserService & CompanyService - Business logic layer
 * 3. React Component - UI layer
 * 4. Test Functions - Testing utilities
 */

// ============================================
// STEP 1: HTTP SERVICE (Core Layer)
// ============================================

/*
Location: src/core/http/abi-http.service.ts

How it works:
1. Constructor takes baseURL (e.g., "http://localhost:3000/api")
2. getHeaders() - Adds auth token to every request automatically
3. request() - Core method that handles all HTTP calls
4. get(), post(), put(), delete() - Specific methods for each HTTP verb

Flow:
┌─────────────────────────────────────┐
│   userService.createUser(data)      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   httpService.post('/users', data)  │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   request(url, {method: 'POST'})    │
│   - Builds full URL                 │
│   - Adds headers + auth token       │
│   - Sends fetch request             │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Checks response.ok                │
│   - If error: throw Error           │
│   - If ok: return response.json()   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Return User object                │
└─────────────────────────────────────┘
*/

// ============================================
// STEP 2: SERVICE LAYER (Business Logic)
// ============================================

/*
Location: src/core/services/example.service.ts

Example: UserService.createUser()

What it does:
1. Takes user data (name, email, role)
2. Calls httpService.post('/users', data)
3. Returns created User object

Code flow:
┌────────────────────────────────────────────────────┐
│ UserService.createUser({                           │
│   name: 'John',                                    │
│   email: 'john@example.com',                       │
│   role: 'admin'                                    │
│ })                                                 │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│ httpService.post<User>('/users', payload)         │
│ - Calls httpService.request()                      │
│ - Method: 'POST'                                   │
│ - Body: stringified JSON                           │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│ Server receives POST /users                        │
│ Creates user in database                           │
│ Returns: { id: 1, name: '...', ... }              │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│ Returns User<T> object to caller                   │
└────────────────────────────────────────────────────┘
*/

// ============================================
// STEP 3: REACT COMPONENT (UI Layer)
// ============================================

/*
Location: src/features/users/UserManagement.tsx

Component lifecycle:

1. USER CLICKS "Fetch All Users"
   ↓
   handleGetAllUsers()
   ├─ setLoading(true)
   ├─ userService.getAllUsers()
   ├─ setUsers(data)
   ├─ setLoading(false)
   └─ Component re-renders

2. USER FILLS FORM & CLICKS "Create User"
   ↓
   handleCreateUser(e)
   ├─ Validate form data
   ├─ setLoading(true)
   ├─ userService.createUser(formData)
   ├─ Add new user to state
   ├─ Clear form
   └─ Component re-renders with new user

3. USER CLICKS "Delete"
   ↓
   handleDeleteUser(userId)
   ├─ setLoading(true)
   ├─ userService.deleteUser(userId)
   ├─ Remove user from state array
   └─ Component re-renders without deleted user
*/

// ============================================
// STEP 4: COMPLETE REQUEST LIFECYCLE EXAMPLE
// ============================================

/*
SCENARIO: User creates a new user named "Alice"

1. USER INTERACTION (Component)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   User fills form:
   - Name: "Alice Smith"
   - Email: "alice@example.com"
   - Role: "admin"
   
   User clicks "Create User" button

2. REACT STATE UPDATES (Component)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   setLoading(true)           → Shows "Loading..."
   setError('')               → Clear previous errors

3. SERVICE LAYER (UserService)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   userService.createUser({
     name: 'Alice Smith',
     email: 'alice@example.com',
     role: 'admin'
   })
   
   Calls: httpService.post('/users', payload)

4. HTTP SERVICE (AbiHttpService)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   post(url, body) calls request(url, options)
   
   request() does:
   - fullUrl = "http://localhost:3000/api" + "/users"
   - headers = {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer <token>'  (if exists)
     }
   - Calls fetch(fullUrl, {
       method: 'POST',
       headers: headers,
       body: JSON.stringify(payload)
     })

5. NETWORK REQUEST
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   POST http://localhost:3000/api/users
   Headers: {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer eyJ...'
   }
   Body: {
     "name": "Alice Smith",
     "email": "alice@example.com",
     "role": "admin"
   }

6. SERVER PROCESSING
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Server receives POST request
   Validates data
   Creates user in database
   Returns: {
     "id": 42,
     "name": "Alice Smith",
     "email": "alice@example.com",
     "role": "admin"
   }
   Status: 200 OK

7. RESPONSE HANDLING (AbiHttpService)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   response.ok = true (status 200)
   response.json() returns User object
   Returns: User<T> to caller

8. SERVICE RETURNS (UserService)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   createUser() returns User object

9. COMPONENT UPDATES (React Component)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   catch block doesn't execute (no error)
   
   finally:
   - setLoading(false)
   - Component re-renders
   - New user appears in table
   - Form clears

10. USER SEES
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Loading spinner disappears
    New "Alice Smith" row appears in Users table
    Form fields are empty
*/

// ============================================
// STEP 5: ERROR HANDLING
// ============================================

/*
If something goes wrong:

SCENARIO: Server returns 404 (Not Found)

1. Server returns: Status 404
2. response.ok = false
3. HTTP Service throws: Error("HTTP Error: 404")
4. Try-catch in Component catches error
5. setError("HTTP Error: 404")
6. finally: setLoading(false)
7. User sees red error message
8. Console shows: Error: HTTP Error: 404
*/

// ============================================
// STEP 6: AUTHENTICATION
// ============================================

/*
How auth token works:

1. User logs in
2. Server returns: { token: "eyJ...", user: {...} }
3. Frontend stores: localStorage.setItem('authToken', token)

4. Next request:
   - getHeaders() reads: localStorage.getItem('authToken')
   - Adds header: 'Authorization': 'Bearer eyJ...'
   - Server validates token in request
   - If valid: Process request
   - If invalid: Return 401 Unauthorized

5. If 401 received:
   - HTTP Service catches it
   - Clears token: localStorage.removeItem('authToken')
   - Redirects: window.location.href = '/login'
   - User logs in again
*/

// ============================================
// QUICK REFERENCE - All HTTP Methods
// ============================================

/*
Method          | Used For        | Endpoint Pattern
────────────────┼─────────────────┼──────────────────
GET /users      | Get all         | httpService.get('/users')
GET /users/1    | Get by ID       | httpService.get('/users/1')
POST /users     | Create new      | httpService.post('/users', data)
PUT /users/1    | Replace entire  | httpService.put('/users/1', data)
DELETE /users/1 | Delete          | httpService.delete('/users/1')

In services:
✓ userService.getAllUsers()
✓ userService.getUserById(1)
✓ userService.createUser(data)
✓ userService.updateUser(1, data)
✓ userService.deleteUser(1)
*/

// ============================================
// TESTING THE FLOW
// ============================================

/*
Three ways to test:

1. BROWSER CONSOLE (Quickest)
   ────────────────────────────
   Open DevTools → Console
   
   import { userService } from './core/services/example.service'
   
   // Get all users
   await userService.getAllUsers().then(console.log)
   
   // Create user
   await userService.createUser({
     name: 'Test',
     email: 'test@example.com',
     role: 'user'
   }).then(console.log)

2. REACT COMPONENT (Full UI Test)
   ────────────────────────────────
   Already created in UserManagement.tsx
   Add to App.tsx and test with UI buttons

3. TEST FUNCTIONS (Automated)
   ──────────────────────────
   Run functions from http.test.ts
   They log all operations to console
*/

export {};
