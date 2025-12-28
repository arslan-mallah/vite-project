/**
 * Mock API Setup for Development
 * This provides fake data without needing a backend server
 * 
 * Add this to your main.tsx before rendering your app
 */

// Mock data storage
const mockDatabase = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user' },
  ],
  companies: [
    { id: 1, name: 'Tech Corp', email: 'info@techcorp.com', phone: '123-456-7890' },
    { id: 2, name: 'Design Inc', email: 'hello@designinc.com', phone: '098-765-4321' },
  ],
  translations: [
    // English
    { key: 'welcome', value: 'Welcome', language: 'en' },
    { key: 'hello', value: 'Hello', language: 'en' },
    { key: 'goodbye', value: 'Goodbye', language: 'en' },
    { key: 'thank_you', value: 'Thank you', language: 'en' },
    { key: 'yes', value: 'Yes', language: 'en' },
    { key: 'no', value: 'No', language: 'en' },
    { key: 'good_morning', value: 'Good Morning', language: 'en' },
    { key: 'good_night', value: 'Good Night', language: 'en' },
    // French
    { key: 'welcome', value: 'Bienvenue', language: 'fr' },
    { key: 'hello', value: 'Bonjour', language: 'fr' },
    { key: 'goodbye', value: 'Au revoir', language: 'fr' },
    { key: 'thank_you', value: 'Merci', language: 'fr' },
    { key: 'yes', value: 'Oui', language: 'fr' },
    { key: 'no', value: 'Non', language: 'fr' },
    { key: 'good_morning', value: 'Bon matin', language: 'fr' },
    { key: 'good_night', value: 'Bonne nuit', language: 'fr' },
    // Spanish
    { key: 'welcome', value: 'Bienvenido', language: 'es' },
    { key: 'hello', value: 'Hola', language: 'es' },
    { key: 'goodbye', value: 'Adiós', language: 'es' },
    { key: 'thank_you', value: 'Gracias', language: 'es' },
    { key: 'yes', value: 'Sí', language: 'es' },
    { key: 'no', value: 'No', language: 'es' },
    { key: 'good_morning', value: 'Buenos días', language: 'es' },
    { key: 'good_night', value: 'Buenas noches', language: 'es' },
    // German
    { key: 'welcome', value: 'Willkommen', language: 'de' },
    { key: 'hello', value: 'Hallo', language: 'de' },
    { key: 'goodbye', value: 'Auf Wiedersehen', language: 'de' },
    { key: 'thank_you', value: 'Danke', language: 'de' },
    { key: 'yes', value: 'Ja', language: 'de' },
    { key: 'no', value: 'Nein', language: 'de' },
    { key: 'good_morning', value: 'Guten Morgen', language: 'de' },
    { key: 'good_night', value: 'Gute Nacht', language: 'de' },
    // Arabic
    { key: 'welcome', value: 'أهلا وسهلا', language: 'ar' },
    { key: 'hello', value: 'مرحبا', language: 'ar' },
    { key: 'goodbye', value: 'وداعا', language: 'ar' },
    { key: 'thank_you', value: 'شكرا', language: 'ar' },
    { key: 'yes', value: 'نعم', language: 'ar' },
    { key: 'no', value: 'لا', language: 'ar' },
    { key: 'good_morning', value: 'صباح الخير', language: 'ar' },
    { key: 'good_night', value: 'تصبح على خير', language: 'ar' },
    // Urdu
    { key: 'welcome', value: 'خوش آمدید', language: 'ur' },
    { key: 'hello', value: 'السلام علیکم', language: 'ur' },
    { key: 'goodbye', value: 'خدا حافظ', language: 'ur' },
    { key: 'thank_you', value: 'شکریہ', language: 'ur' },
    { key: 'yes', value: 'جی', language: 'ur' },
    { key: 'no', value: 'نہیں', language: 'ur' },
    { key: 'good_morning', value: 'صبح بخیر', language: 'ur' },
    { key: 'good_night', value: 'رات بخیر', language: 'ur' },
    // Portuguese
    { key: 'welcome', value: 'Bem-vindo', language: 'pt' },
    { key: 'hello', value: 'Olá', language: 'pt' },
    { key: 'goodbye', value: 'Adeus', language: 'pt' },
    { key: 'thank_you', value: 'Obrigado', language: 'pt' },
    { key: 'yes', value: 'Sim', language: 'pt' },
    { key: 'no', value: 'Não', language: 'pt' },
    { key: 'good_morning', value: 'Bom dia', language: 'pt' },
    { key: 'good_night', value: 'Boa noite', language: 'pt' },
    // Hindi
    { key: 'welcome', value: 'स्वागत है', language: 'hi' },
    { key: 'hello', value: 'नमस्ते', language: 'hi' },
    { key: 'goodbye', value: 'अलविदा', language: 'hi' },
    { key: 'thank_you', value: 'धन्यवाद', language: 'hi' },
    { key: 'yes', value: 'हाँ', language: 'hi' },
    { key: 'no', value: 'नहीं', language: 'hi' },
    { key: 'good_morning', value: 'सुप्रभात', language: 'hi' },
    { key: 'good_night', value: 'शुभ रात्रि', language: 'hi' },
    // Japanese
    { key: 'welcome', value: 'ようこそ', language: 'ja' },
    { key: 'hello', value: 'こんにちは', language: 'ja' },
    { key: 'goodbye', value: 'さようなら', language: 'ja' },
    { key: 'thank_you', value: 'ありがとう', language: 'ja' },
    { key: 'yes', value: 'はい', language: 'ja' },
    { key: 'no', value: 'いいえ', language: 'ja' },
    { key: 'good_morning', value: 'おはよう', language: 'ja' },
    { key: 'good_night', value: 'おやすみなさい', language: 'ja' },
    // Chinese
    { key: 'welcome', value: '欢迎', language: 'zh' },
    { key: 'hello', value: '你好', language: 'zh' },
    { key: 'goodbye', value: '再见', language: 'zh' },
    { key: 'thank_you', value: '谢谢', language: 'zh' },
    { key: 'yes', value: '是的', language: 'zh' },
    { key: 'no', value: '不', language: 'zh' },
    { key: 'good_morning', value: '早上好', language: 'zh' },
    { key: 'good_night', value: '晚安', language: 'zh' },
    // Korean
    { key: 'welcome', value: '환영합니다', language: 'ko' },
    { key: 'hello', value: '안녕하세요', language: 'ko' },
    { key: 'goodbye', value: '안녕히 가세요', language: 'ko' },
    { key: 'thank_you', value: '감사합니다', language: 'ko' },
    { key: 'yes', value: '네', language: 'ko' },
    { key: 'no', value: '아니오', language: 'ko' },
    { key: 'good_morning', value: '좋은 아침입니다', language: 'ko' },
    { key: 'good_night', value: '안녕히 주무세요', language: 'ko' },
    // Russian
    { key: 'welcome', value: 'Добро пожаловать', language: 'ru' },
    { key: 'hello', value: 'Привет', language: 'ru' },
    { key: 'goodbye', value: 'До свидания', language: 'ru' },
    { key: 'thank_you', value: 'Спасибо', language: 'ru' },
    { key: 'yes', value: 'Да', language: 'ru' },
    { key: 'no', value: 'Нет', language: 'ru' },
    { key: 'good_morning', value: 'Доброе утро', language: 'ru' },
    { key: 'good_night', value: 'Спокойной ночи', language: 'ru' },
    // Italian
    { key: 'welcome', value: 'Benvenuto', language: 'it' },
    { key: 'hello', value: 'Ciao', language: 'it' },
    { key: 'goodbye', value: 'Arrivederci', language: 'it' },
    { key: 'thank_you', value: 'Grazie', language: 'it' },
    { key: 'yes', value: 'Sì', language: 'it' },
    { key: 'no', value: 'No', language: 'it' },
    { key: 'good_morning', value: 'Buongiorno', language: 'it' },
    { key: 'good_night', value: 'Buonanotte', language: 'it' },
  ],
};

let nextUserId = 4;
let nextCompanyId = 3;

/**
 * Setup Mock API
 * Intercepts fetch requests and returns mock data
 */
export function setupMockAPI() {
  const originalFetch = window.fetch;

  (window as unknown as { fetch: typeof originalFetch }).fetch = function (url: string, options?: RequestInit): Promise<Response> {
    // Simulate network delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Handle /api/users endpoints
    if (url.includes('/api/users')) {
      return delay(500).then((): Response => {
        const method = options?.method || 'GET';
        const urlPath = url.split('/api/users')[1] || '';

        // GET /users - Get all users
        if (method === 'GET' && !urlPath) {
          return new Response(JSON.stringify(mockDatabase.users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // GET /users/:id - Get user by ID
        if (method === 'GET' && urlPath.match(/^\/\d+$/)) {
          const id = parseInt(urlPath.substring(1));
          const user = mockDatabase.users.find(u => u.id === id);
          if (user) {
            return new Response(JSON.stringify(user), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // POST /users - Create new user
        if (method === 'POST' && !urlPath) {
          const body = JSON.parse(options?.body as string);
          const newUser = {
            id: nextUserId++,
            ...body,
          };
          mockDatabase.users.push(newUser);
          return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // PUT /users/:id - Update user
        if (method === 'PUT' && urlPath.match(/^\/\d+$/)) {
          const id = parseInt(urlPath.substring(1));
          const body = JSON.parse(options?.body as string);
          const userIndex = mockDatabase.users.findIndex(u => u.id === id);
          if (userIndex !== -1) {
            mockDatabase.users[userIndex] = { ...mockDatabase.users[userIndex], ...body };
            return new Response(JSON.stringify(mockDatabase.users[userIndex]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // DELETE /users/:id - Delete user
        if (method === 'DELETE' && urlPath.match(/^\/\d+$/)) {
          const id = parseInt(urlPath.substring(1));
          const userIndex = mockDatabase.users.findIndex(u => u.id === id);
          if (userIndex !== -1) {
            const deletedUser = mockDatabase.users.splice(userIndex, 1)[0];
            return new Response(JSON.stringify(deletedUser), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    // Handle /api/companies endpoints
    if (url.includes('/api/companies')) {
      return delay(500).then((): Response => {
        const method = options?.method || 'GET';
        const urlPath = url.split('/api/companies')[1] || '';

        // GET /companies - Get all companies
        if (method === 'GET' && !urlPath) {
          return new Response(JSON.stringify(mockDatabase.companies), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // GET /companies/:id - Get company by ID
        if (method === 'GET' && urlPath.match(/^\/\d+$/)) {
          const id = parseInt(urlPath.substring(1));
          const company = mockDatabase.companies.find(c => c.id === id);
          if (company) {
            return new Response(JSON.stringify(company), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'Company not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // POST /companies - Create new company
        if (method === 'POST' && !urlPath) {
          const body = JSON.parse(options?.body as string);
          const newCompany = {
            id: nextCompanyId++,
            ...body,
          };
          mockDatabase.companies.push(newCompany);
          return new Response(JSON.stringify(newCompany), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // PUT /companies/:id - Update company
        if (method === 'PUT' && urlPath.match(/^\/\d+$/)) {
          const id = parseInt(urlPath.substring(1));
          const body = JSON.parse(options?.body as string);
          const companyIndex = mockDatabase.companies.findIndex(c => c.id === id);
          if (companyIndex !== -1) {
            mockDatabase.companies[companyIndex] = { ...mockDatabase.companies[companyIndex], ...body };
            return new Response(JSON.stringify(mockDatabase.companies[companyIndex]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'Company not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // DELETE /companies/:id - Delete company
        if (method === 'DELETE' && urlPath.match(/^\/\d+$/)) {
          const id = parseInt(urlPath.substring(1));
          const companyIndex = mockDatabase.companies.findIndex(c => c.id === id);
          if (companyIndex !== -1) {
            const deletedCompany = mockDatabase.companies.splice(companyIndex, 1)[0];
            return new Response(JSON.stringify(deletedCompany), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'Company not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    // Handle /api/translations endpoints
    if (url.includes('/api/translations')) {
      return delay(500).then((): Response => {
        const method = options?.method || 'GET';
        const urlPath = url.split('/api/translations')[1] || '';
        const queryParams = new URL(url).searchParams;
        const lang = queryParams.get('lang') || 'en';

        // GET /translations?lang=en - Get all translations for a language
        if (method === 'GET' && !urlPath) {
          const filtered = mockDatabase.translations.filter(t => t.language === lang);
          return new Response(JSON.stringify(filtered), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // GET /translations/:key?lang=en - Get single translation by key
        if (method === 'GET' && urlPath) {
          const key = urlPath.substring(1);
          const translation = mockDatabase.translations.find(t => t.key === key && t.language === lang);
          if (translation) {
            return new Response(JSON.stringify(translation), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'Translation not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // POST /translations - Create new translation
        if (method === 'POST' && !urlPath) {
          const body = JSON.parse(options?.body as string);
          const existing = mockDatabase.translations.findIndex(
            t => t.key === body.key && t.language === body.language
          );
          if (existing !== -1) {
            mockDatabase.translations[existing] = body;
          } else {
            mockDatabase.translations.push(body);
          }
          return new Response(JSON.stringify(body), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // DELETE /translations/:key?lang=en - Delete translation
        if (method === 'DELETE' && urlPath) {
          const key = urlPath.substring(1);
          const index = mockDatabase.translations.findIndex(t => t.key === key && t.language === lang);
          if (index !== -1) {
            const deleted = mockDatabase.translations.splice(index, 1)[0];
            return new Response(JSON.stringify(deleted), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ error: 'Translation not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    // Fall back to original fetch for other requests
    return originalFetch.call(this, url, options);
  };

  console.log('✅ Mock API Setup Complete');
  console.log('Available mock endpoints:');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/:id');
  console.log('  POST   /api/users');
  console.log('  PUT    /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('  GET    /api/companies');
  console.log('  POST   /api/companies');
  console.log('  PUT    /api/companies/:id');
  console.log('  DELETE /api/companies/:id');
  console.log('  GET    /api/translations?lang=en');
  console.log('  GET    /api/translations/:key?lang=en');
  console.log('  POST   /api/translations');
  console.log('  DELETE /api/translations/:key?lang=en');
}

/**
 * Disable Mock API - Use real backend
 */
export function disableMockAPI() {
  location.reload();
}
