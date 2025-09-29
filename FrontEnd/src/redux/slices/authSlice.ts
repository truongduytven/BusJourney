import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  user: any | null;
  // States for registration process
  isRegistering: boolean;
  registrationEmail: string | null;
  awaitingOTPVerification: boolean;
}

// Helper functions
const getStoredToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const saveToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

const initialState: AuthState = {
  isAuthenticated: !!getStoredToken(),
  token: getStoredToken(),
  loading: false,
  error: null,
  user: null,
  isRegistering: false,
  registrationEmail: null,
  awaitingOTPVerification: false,
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.user = null;
      state.isRegistering = false;
      state.registrationEmail = null;
      state.awaitingOTPVerification = false;
      removeToken();
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      saveToken(action.payload);
    },
    clearRegistrationState: (state) => {
      state.isRegistering = false;
      state.registrationEmail = null;
      state.awaitingOTPVerification = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.error = null;
        if (action.payload.success && action.payload.data?.token) {
          state.isAuthenticated = true;
          state.token = action.payload.data.token;
        }
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
        state.isAuthenticated = false;
        state.token = null;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy thông tin thất bại';
        // Nếu token không hợp lệ, logout user
        if (action.payload?.includes('token') || action.payload?.includes('Unauthorized')) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          removeToken();
        }
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isRegistering = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.loading = false;
        state.error = null;
        
        if (action.payload.success && action.payload.data?.email) {
          state.registrationEmail = action.payload.data.email;
          state.awaitingOTPVerification = true;
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isRegistering = false;
        state.loading = false;
        
        try {
          const errorData = JSON.parse(action.payload || '{}');
          
          // Trường hợp tài khoản đã đăng ký nhưng chưa xác thực
          if (errorData.code === 'ACCOUNT_NOT_VERIFIED' && errorData.data?.email) {
            state.registrationEmail = errorData.data.email;
            state.awaitingOTPVerification = true;
            state.error = null; // Không hiển thị lỗi vì sẽ chuyển sang form OTP
          } else {
            state.error = errorData.message || action.payload || 'Đăng ký thất bại';
          }
        } catch {
          state.error = action.payload || 'Đăng ký thất bại';
        }
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        if (action.payload.success) {
          state.awaitingOTPVerification = false;
          state.registrationEmail = null;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Xác thực OTP thất bại';
      })
      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Gửi lại OTP thất bại';
      })
      // Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        if (action.payload.success && action.payload.data) {
          state.isAuthenticated = true;
          state.token = action.payload.data.token;
        }
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng nhập Google thất bại';
      });
  },
});

export const { logout, clearError, setToken, clearRegistrationState } = authSlice.actions;
export default authSlice.reducer;