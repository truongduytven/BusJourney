import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiPost, apiAuthGet, apiAuthFetch } from '../../utils/apiHelper';

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
      const data = await apiPost<SignInResponse>('/auth/signin', credentials);

      if (!data.success) {
        return rejectWithValue(JSON.stringify(data));
      }

      if (data.data?.token) {
        saveToken(data.data.token);
      }

      return data as SignInResponse;
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

      const data = await apiAuthGet('/auth/me', token);

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to get profile');
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
      const data = await apiPost<SignUpResponse>('/auth/signup', userData);

      if (!data.success) {
        // Trả về object với thông tin đầy đủ để xử lý trường hợp đặc biệt
        return rejectWithValue(JSON.stringify({
          message: data.message || 'Sign up failed',
          code: (data as any).code,
          data: data.data
        }));
      }

      return data as SignUpResponse;
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
      const data = await apiPost<VerifyOTPResponse>('/auth/verify-otp', otpData);

      if (!data.success) {
        return rejectWithValue(data.message || 'OTP verification failed');
      }

      return data as VerifyOTPResponse;
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
      const data = await apiPost('/auth/resend-otp', emailData);

      if (!data.success) {
        return rejectWithValue(data.message || 'Resend OTP failed');
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
      const data = await apiPost<GoogleSignInResponse>('/auth/google-signin', request);

      if (!data.success) {
        return rejectWithValue(data.message || 'Google sign in failed');
      }

      // Lưu token vào localStorage
      if (data.data?.token) {
        saveToken(data.data.token);
      }

      return data as GoogleSignInResponse;
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

      const data = await apiAuthFetch('/auth/update-phone', token, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!data.success) {
        return rejectWithValue(data.message || 'Cập nhật số điện thoại thất bại');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Cập nhật số điện thoại thất bại');
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
      })
      // Update phone cases
      .addCase(updatePhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhone.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Optionally update user phone in state if we have user data
        // state.user.phone = action.meta.arg.phone;
      })
      .addCase(updatePhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Cập nhật số điện thoại thất bại';
      });
  },
});

export const { logout, clearError, setToken, clearRegistrationState } = authSlice.actions;
export default authSlice.reducer;