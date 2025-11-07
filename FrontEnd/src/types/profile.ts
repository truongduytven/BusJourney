export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  type: string;
  isVerified: boolean;
  isActive: boolean;
  createAt: string;
  roles?: any;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}
