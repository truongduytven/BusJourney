import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '@/redux/slices/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    expiresIn: string;
  };
  error?: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: {
    accountId: string;
    email: string;
  };
  error?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface GoogleSignInRequest {
  credential: string;
}

export interface GoogleSignInResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    expiresIn: string;
  };
  error?: string;
}

// Helper functions
const getStoredToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const saveToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Async thunk for sign in
export const signIn = createAsyncThunk<
  SignInResponse,
  SignInRequest,
  { rejectValue: string }
>(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data || { message: `HTTP error! status: ${response.status}` });
      }

      if (data.success && data.data?.token) {
        saveToken(data.data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    }
  }
);

// Async thunk for getting user profile
export const getProfile = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>(
  'auth/getProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Không có token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || `HTTP error! status: ${response.status}`);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Lấy thông tin thất bại');
    }
  }
);

// Async thunk for sign up
export const signUp = createAsyncThunk<
  SignUpResponse,
  SignUpRequest,
  { rejectValue: string }
>(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Trả về object với thông tin đầy đủ để xử lý trường hợp đặc biệt
        return rejectWithValue(JSON.stringify({
          message: data.message || `HTTP error! status: ${response.status}`,
          code: data.code,
          data: data.data
        }));
      }

      return data;
    } catch (error) {
      return rejectWithValue(JSON.stringify({
        message: error instanceof Error ? error.message : 'Đăng ký thất bại'
      }));
    }
  }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk<
  VerifyOTPResponse,
  VerifyOTPRequest,
  { rejectValue: string }
>(
  'auth/verifyOTP',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Xác thực OTP thất bại');
    }
  }
);

// Async thunk for resending OTP
export const resendOTP = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>(
  'auth/resendOTP',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Gửi lại OTP thất bại');
    }
  }
);

// Async thunk for Google sign in
export const googleSignIn = createAsyncThunk<
  GoogleSignInResponse,
  GoogleSignInRequest,
  { rejectValue: string }
>(
  'auth/googleSignIn',
  async (request, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: GoogleSignInResponse = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Google sign in failed');
      }

      // Lưu token vào localStorage
      if (data.data?.token) {
        saveToken(data.data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Google sign in failed');
    }
  }
);

// Update phone async thunk
export const updatePhone = createAsyncThunk<
  { success: boolean; message: string },
  { phone: string },
  { rejectValue: string }
>(
  'auth/updatePhone',
  async (request, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) {
        return rejectWithValue('Không tìm thấy token xác thực');
      }

      const response = await fetch(`${API_BASE_URL}/auth/update-phone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Cập nhật số điện thoại thất bại');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Cập nhật số điện thoại thất bại');
    }
  }
);
