const mockPost = jest.fn();
const mockAuthApiInstance = {
  post: mockPost,
  // Add other methods if auth.ts ever uses them on authApi
  // For example, if authApi.get was used:
  // get: jest.fn(),
};

const mockCreate = jest.fn(() => mockAuthApiInstance);

// The module 'axios' itself might be callable or have static methods like 'isAxiosError'
const axios = jest.fn(); // If axios itself is ever called as a function
axios.create = mockCreate;
axios.post = jest.fn(); // For general axios.post if used elsewhere
axios.get = jest.fn();  // For general axios.get if used elsewhere
axios.isAxiosError = jest.fn().mockReturnValue(false);
axios.AxiosError = class extends Error {
  constructor(message) {
    super(message);
    this.name = 'AxiosError';
    this.isAxiosError = true;
  }
};

// Export the mock. When `import axios from 'axios'` is used, this is what tests will get.
// Crucially, `axios.create()` will use the `mockCreate` defined above.
module.exports = axios;
