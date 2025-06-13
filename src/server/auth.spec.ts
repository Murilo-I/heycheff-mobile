import axios_actual_for_types from 'axios'; // For AxiosError type if needed, will be unmocked version
import axios from 'axios'; // This will be the mock from __mocks__/axios.js
import { authServer } from './auth';
import { jwtStorage } from '@/storage/jwt';
import { userId } from '@/storage/userId';

// --- Mocks ---
// Manual mock for axios is in __mocks__/axios.js
// Jest will automatically pick it up.

jest.mock('@/storage/jwt', () => ({
  jwtStorage: {
    save: jest.fn(),
  },
}));

jest.mock('@/storage/userId', () => ({
  userId: {
    save: jest.fn(),
  },
}));

// Get a reference to the mock 'post' function that authApi will use.
// axios.create() from our manual mock returns an instance whose 'post' method is a specific jest.fn().
const authApiPostMock = axios.create().post as jest.Mock; // Cast to jest.Mock

let consoleLogSpy: jest.SpyInstance;

// --- Tests ---

describe('Auth Service (authServer)', () => {
  beforeEach(() => {
    // Clear all standard mocks.
    jest.clearAllMocks();
    // Reset the implementation and call history of the shared mock post function.
    authApiPostMock.mockReset();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('authenticate', () => {
    const mockUsername = 'testuser';
    const mockPassword = 'password';
    const mockSuccessResponse = {
      data: {
        token: 'mock-jwt-token',
        type: 'Bearer',
        userId: 'user-123',
        issuedAt: new Date(),
        expiration: new Date(Date.now() + 3600 * 1000),
      },
      status: 200,
    };

    it('should call authApi.post with correct URL and credentials', async () => {
      authApiPostMock.mockResolvedValue(mockSuccessResponse);
      await authServer.authenticate(mockUsername, mockPassword);
      expect(authApiPostMock).toHaveBeenCalledWith('/auth', {
        username: mockUsername,
        password: mockPassword,
      });
    });

    it('should save token and userId on successful authentication', async () => {
      authApiPostMock.mockResolvedValue(mockSuccessResponse);
      await authServer.authenticate(mockUsername, mockPassword);

      expect(jwtStorage.save).toHaveBeenCalledWith(
        mockSuccessResponse.data.token,
        mockSuccessResponse.data.expiration.toString()
      );
      expect(userId.save).toHaveBeenCalledWith(mockSuccessResponse.data.userId);
    });

    it('should return the status code on successful authentication', async () => {
      authApiPostMock.mockResolvedValue(mockSuccessResponse);
      const status = await authServer.authenticate(mockUsername, mockPassword);
      expect(status).toBe(200);
    });

    it('should log error and return undefined on failed authentication (generic error)', async () => {
      const mockError = new Error('Network Error');
      authApiPostMock.mockRejectedValue(mockError);

      const status = await authServer.authenticate(mockUsername, mockPassword);

      expect(consoleLogSpy).toHaveBeenCalledWith("Error authenticating: " + mockError);
      expect(jwtStorage.save).not.toHaveBeenCalled();
      expect(userId.save).not.toHaveBeenCalled();
      expect(status).toBeUndefined();
    });

    it('should log error and return undefined on failed authentication (Axios error)', async () => {
      // Use the actual AxiosError class for constructing the error object if needed for type checks
      // For this test, auth.ts doesn't deeply inspect the error beyond logging it.
      const mockAxiosErrorInstance = new (jest.requireActual('axios').AxiosError)(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST', // Optional error code
        undefined, // config
        undefined, // request
        { // response
          status: 401,
          data: { message: 'Invalid credentials' },
          headers: {}, config: {} as any, statusText: 'Unauthorized'
        } as any
      );

      authApiPostMock.mockRejectedValue(mockAxiosErrorInstance);

      const status = await authServer.authenticate(mockUsername, mockPassword);

      expect(consoleLogSpy).toHaveBeenCalledWith("Error authenticating: " + mockAxiosErrorInstance);
      expect(jwtStorage.save).not.toHaveBeenCalled();
      expect(userId.save).not.toHaveBeenCalled();
      expect(status).toBeUndefined();
    });
  });

  describe('authenticateWithClerk', () => {
    const mockSessionId = 'clerk-session-id';
    const mockUserEmail = 'clerkuser@example.com';
    const mockClerkSuccessResponse = {
      data: {
        token: 'mock-clerk-jwt-token',
        type: 'Bearer',
        userId: 'clerk-user-456',
        issuedAt: new Date(),
        expiration: new Date(Date.now() + 3600 * 1000),
      },
      status: 201,
    };

    it('should call authApi.post with correct URL and Clerk data', async () => {
      authApiPostMock.mockResolvedValue(mockClerkSuccessResponse);
      await authServer.authenticateWithClerk(mockSessionId, mockUserEmail);
      expect(authApiPostMock).toHaveBeenCalledWith('/auth/clerk', {
        sessionId: mockSessionId,
        userEmail: mockUserEmail,
      });
    });

    it('should save token and userId on successful Clerk authentication', async () => {
      authApiPostMock.mockResolvedValue(mockClerkSuccessResponse);
      await authServer.authenticateWithClerk(mockSessionId, mockUserEmail);

      expect(jwtStorage.save).toHaveBeenCalledWith(
        mockClerkSuccessResponse.data.token,
        mockClerkSuccessResponse.data.expiration.toString()
      );
      expect(userId.save).toHaveBeenCalledWith(mockClerkSuccessResponse.data.userId);
    });

    it('should return the status code on successful Clerk authentication', async () => {
      authApiPostMock.mockResolvedValue(mockClerkSuccessResponse);
      const status = await authServer.authenticateWithClerk(mockSessionId, mockUserEmail);
      expect(status).toBe(201);
    });

    it('should log error and return undefined on failed Clerk authentication', async () => {
      const mockError = new Error('Clerk auth failed');
      authApiPostMock.mockRejectedValue(mockError);

      const status = await authServer.authenticateWithClerk(mockSessionId, mockUserEmail);

      expect(consoleLogSpy).toHaveBeenCalledWith("Error authenticating: " + mockError);
      expect(jwtStorage.save).not.toHaveBeenCalled();
      expect(userId.save).not.toHaveBeenCalled();
      expect(status).toBeUndefined();
    });
  });
});
