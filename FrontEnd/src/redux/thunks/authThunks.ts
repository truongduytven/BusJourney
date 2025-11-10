import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '@/redux/slices/authSlice';
import apiClient from '@/lib/axios';

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
      const resp = await apiClient.post('/auth/signin', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = resp.data as SignInResponse;

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

      const resp = await apiClient.get('/auth/me', { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      const data = resp.data;
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
      const resp = await apiClient.post('/auth/signup', userData, { headers: { 'Content-Type': 'application/json' } });
      const data = resp.data;
      if (!data.success) {
        return rejectWithValue(JSON.stringify({ message: data.message || 'Signup failed', code: data.code, data: data.data }));
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
      const resp = await apiClient.post('/auth/verify-otp', otpData, { headers: { 'Content-Type': 'application/json' } });
      return resp.data;
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
      const resp = await apiClient.post('/auth/resend-otp', emailData, { headers: { 'Content-Type': 'application/json' } });
      return resp.data;
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
      const resp = await apiClient.post('/auth/google-signin', request, { headers: { 'Content-Type': 'application/json' } });
      const data: GoogleSignInResponse = resp.data;
      if (!data.success) return rejectWithValue(data.message || 'Google sign in failed');
      if (data.data?.token) saveToken(data.data.token);
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

      const resp = await apiClient.put('/auth/update-phone', request, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      const data = resp.data;
      if (!data.success) return rejectWithValue(data.message || 'Cập nhật số điện thoại thất bại');
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Cập nhật số điện thoại thất bại');
    }
  }
);
