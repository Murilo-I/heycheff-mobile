import axios, { type AxiosRequestConfig, type AxiosError as AxiosErrorType, AxiosHeaders } from 'axios'; // Removed RawAxiosHeaders
import realApiInstance from './api';
import { jwtStorage } from '@/storage/jwt';
import { router } from 'expo-router';

// --- Start Mocks ---

const mockAxiosInstance = jest.fn((config?: any) => {
  if (mockAxiosInstance.request) {
    return mockAxiosInstance.request(config);
  }
  return Promise.reject(new Error('Axios instance called but .request is not mocked'));
}) as any;

mockAxiosInstance.interceptors = {
  request: { use: jest.fn(), eject: jest.fn() },
  response: { use: jest.fn(), eject: jest.fn() },
};
mockAxiosInstance.get = jest.fn(() => Promise.resolve({ data: {} }));
mockAxiosInstance.post = jest.fn(() => Promise.resolve({ data: {} }));
mockAxiosInstance.put = jest.fn(() => Promise.resolve({ data: {} }));
mockAxiosInstance.delete = jest.fn(() => Promise.resolve({ data: {} }));
mockAxiosInstance.patch = jest.fn(() => Promise.resolve({ data: {} }));
mockAxiosInstance.request = jest.fn(() => Promise.resolve({ data: {} }));
mockAxiosInstance.defaults = { headers: new AxiosHeaders() };
mockAxiosInstance.defaults.headers.common = {};


jest.mock('axios', () => {
    const actualAxios = jest.requireActual('axios');
    return {
        create: jest.fn(() => mockAxiosInstance),
        AxiosError: actualAxios.AxiosError,
        isAxiosError: actualAxios.isAxiosError,
        AxiosHeaders: actualAxios.AxiosHeaders,
    };
});

jest.mock('@/storage/jwt', () => ({
  jwtStorage: {
    getToken: jest.fn(),
    save: jest.fn(),
    getExpiration: jest.fn(),
    removeAll: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
  },
}));

// --- End Mocks ---

import apiModuleInstance from './api';

interface TestAxiosRequestConfig extends AxiosRequestConfig {
  _retry403Count?: number;
  headers: AxiosHeaders;
}

// Helper to create a valid minimal AxiosRequestConfig for tests
// Use Record<string, any> for plain object headers type
const createMockRequestConfig = (headersInit?: AxiosHeaders | Record<string, any>): TestAxiosRequestConfig => ({
    headers: headersInit instanceof AxiosHeaders ? headersInit : new AxiosHeaders(headersInit),
    url: '/test-url',
    method: 'get',
});


describe('API Interceptors', () => {
  let requestInterceptor: (config: TestAxiosRequestConfig) => Promise<TestAxiosRequestConfig>;
  let responseInterceptorErrorHandler: (error: any) => Promise<any>;

  if ((mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls.length > 0) {
    requestInterceptor = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
  } else {
    console.error("Request interceptor function not captured.");
    requestInterceptor = async (config) => config;
  }

  if ((mockAxiosInstance.interceptors.response.use as jest.Mock).mock.calls.length > 0) {
    responseInterceptorErrorHandler = (mockAxiosInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];
  } else {
    console.error("Response interceptor functions not captured.");
    responseInterceptorErrorHandler = async (error) => Promise.reject(error);
  }

  beforeEach(() => {
    (jwtStorage.getToken as jest.Mock).mockClear().mockResolvedValue(null);
    (router.navigate as jest.Mock).mockClear();

    (mockAxiosInstance as jest.Mock).mockClear();
    (mockAxiosInstance.get as jest.Mock).mockClear();
    (mockAxiosInstance.post as jest.Mock).mockClear();
    (mockAxiosInstance.put as jest.Mock).mockClear();
    (mockAxiosInstance.delete as jest.Mock).mockClear();
    (mockAxiosInstance.patch as jest.Mock).mockClear();
    (mockAxiosInstance.request as jest.Mock).mockClear().mockResolvedValue({ data: {} });
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header if token exists', async () => {
      const mockToken = 'test-token123';
      (jwtStorage.getToken as jest.Mock).mockResolvedValue(mockToken);
      const mockConfig = createMockRequestConfig();
      const updatedConfig = await requestInterceptor(mockConfig);
      expect(jwtStorage.getToken).toHaveBeenCalledTimes(1);
      expect(updatedConfig.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });

    it('should set Authorization header to "Bearer null" if token does not exist', async () => {
      (jwtStorage.getToken as jest.Mock).mockResolvedValue(null);
      const mockConfig = createMockRequestConfig();
      const updatedConfig = await requestInterceptor(mockConfig);
      expect(jwtStorage.getToken).toHaveBeenCalledTimes(1);
      expect(updatedConfig.headers.get('Authorization')).toBe('Bearer null');
    });
  });

  describe('Response Interceptor (Error Handler)', () => {
    const createAxiosError = (status: number, configOverride?: Partial<TestAxiosRequestConfig>): AxiosErrorType => {
        let baseConfig = createMockRequestConfig();

        let headersForOverride: AxiosHeaders | undefined;
        if (configOverride?.headers) {
            if (configOverride.headers instanceof AxiosHeaders) {
                headersForOverride = configOverride.headers;
            } else {
                // Ensure plain objects are cast appropriately for AxiosHeaders constructor
                headersForOverride = new AxiosHeaders(configOverride.headers as Record<string, any>);
            }
        }

        const finalConfig: TestAxiosRequestConfig = {
            ...baseConfig,
            ...configOverride,
            headers: headersForOverride || baseConfig.headers,
        };

        if (configOverride && configOverride._retry403Count !== undefined) {
            finalConfig._retry403Count = configOverride._retry403Count;
        }

        const err = new axios.AxiosError(
            `Request failed with status code ${status}`,
            undefined,
            finalConfig as any,
            undefined,
            {
                status,
                data: {},
                headers: new AxiosHeaders(),
                config: finalConfig as any,
                statusText: 'Error'
            }
        );
        return err;
    };

    it('should attempt one retry if status is 403 and retry count is 0', async () => {
      const error = createAxiosError(403, { _retry403Count: 0 });
      (mockAxiosInstance.request as jest.Mock).mockRejectedValue(error);

      try {
        await responseInterceptorErrorHandler(error);
      } catch (e) { /* Expected */ }

      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(1);
      const requestCallConfig = (mockAxiosInstance.request as jest.Mock).mock.calls[0][0] as TestAxiosRequestConfig;
      expect(requestCallConfig._retry403Count).toBe(1);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should attempt one retry if status is 403 and retry count is 4', async () => {
      const error = createAxiosError(403, { _retry403Count: 4 });
      (mockAxiosInstance.request as jest.Mock).mockRejectedValue(error);

      try {
        await responseInterceptorErrorHandler(error);
      } catch (e) { /* Expected */ }

      expect(mockAxiosInstance.request).toHaveBeenCalledTimes(1);
      const requestCallConfig = (mockAxiosInstance.request as jest.Mock).mock.calls[0][0] as TestAxiosRequestConfig;
      expect(requestCallConfig._retry403Count).toBe(5);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to login and not retry if status is 403 and retry count is already 5', async () => {
      const error = createAxiosError(403, { _retry403Count: 5 });
      try {
        await responseInterceptorErrorHandler(error);
      } catch (e) { /* Can either reject or resolve after navigation */ }
      expect(mockAxiosInstance.request).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith('/start/login');
    });

    it('should reject with the error and not retry if status is not 403', async () => {
      const error = createAxiosError(500);
      await expect(responseInterceptorErrorHandler(error)).rejects.toEqual(error);
      expect(mockAxiosInstance.request).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should reject with the error and not retry if it is not an Axios error', async () => {
      const error = new Error('Network Error');
      await expect(responseInterceptorErrorHandler(error)).rejects.toEqual(error);
      expect(mockAxiosInstance.request).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
