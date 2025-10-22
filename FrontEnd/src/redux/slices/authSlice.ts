import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  signIn,
  getProfile,
  signUp,
  verifyOTP,
  resendOTP,
  googleSignIn,
  updatePhone,
} from '@/redux/thunks/authThunks';

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