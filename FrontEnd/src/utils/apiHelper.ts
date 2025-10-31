/**
 * API Helper for handling fetch requests with consistent error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Helper function to make API requests with consistent error handling
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok and contains JSON
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
      // For non-JSON responses, try to get text
      const text = await response.text();
      return {
        success: false,
        message: text || `HTTP error! status: ${response.status}`,
        error: text || 'Unknown error',
      } as T;
    }
    
    const data = await response.json();

    // Return the data as-is since the API already has the proper structure
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network request failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as T;
  }
}

/**
 * Helper function to make authenticated API requests
 */
export async function apiAuthFetch<T = any>(
  endpoint: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Helper function for POST requests
 */
export async function apiPost<T = any>(
  endpoint: string,
  body: any,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Helper function for GET requests
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * Helper function for authenticated POST requests
 */
export async function apiAuthPost<T = any>(
  endpoint: string,
  token: string,
  body: any,
  options: FetchOptions = {}
): Promise<T> {
  return apiAuthFetch<T>(endpoint, token, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Helper function for authenticated GET requests
 */
export async function apiAuthGet<T = any>(
  endpoint: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  return apiAuthFetch<T>(endpoint, token, {
    ...options,
    method: 'GET',
  });
}
