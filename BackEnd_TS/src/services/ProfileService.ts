import Account from '../models/Accounts';
import cloudinary from '../config/cloudinary';
import bcrypt from 'bcrypt';

interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  /**
   * Get user profile by account ID
   */
  async getProfile(accountId: string) {
    try {
      const account = await Account.query()
        .findById(accountId)
        .withGraphFetched('roles')
        .select('id', 'name', 'email', 'phone', 'avatar', 'address', 'type', 'isVerified', 'isActive', 'createAt');

      if (!account) {
        return {
          success: false,
          message: 'Tài khoản không tồn tại',
        };
      }

      return {
        success: true,
        message: 'Lấy thông tin tài khoản thành công',
        data: account,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(accountId: string, updateData: UpdateProfileData) {
    try {
      const account = await Account.query().findById(accountId);

      if (!account) {
        return {
          success: false,
          message: 'Tài khoản không tồn tại',
        };
      }

      // Check if phone is being updated and if it's already taken by another user
      if (updateData.phone && updateData.phone !== account.phone) {
        const existingPhone = await Account.query()
          .where('phone', updateData.phone)
          .whereNot('id', accountId)
          .first();

        if (existingPhone) {
          return {
            success: false,
            message: 'Số điện thoại đã được sử dụng',
          };
        }
      }

      // Update profile
      const updatedAccount = await Account.query()
        .patchAndFetchById(accountId, updateData)
        .withGraphFetched('roles')
        .select('id', 'name', 'email', 'phone', 'avatar', 'address', 'type', 'isVerified', 'isActive', 'createAt');

      return {
        success: true,
        message: 'Cập nhật thông tin thành công',
        data: updatedAccount,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Upload avatar to Cloudinary
   */
  async uploadAvatar(accountId: string, file: Express.Multer.File) {
    try {
      const account = await Account.query().findById(accountId);

      if (!account) {
        return {
          success: false,
          message: 'Tài khoản không tồn tại',
        };
      }

      // Delete old avatar from Cloudinary if exists
      if (account.avatar) {
        const publicId = this.extractPublicIdFromUrl(account.avatar);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error('Error deleting old avatar:', error);
          }
        }
      }

      // Upload new avatar to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'avatars',
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      // Update avatar URL in database
      const updatedAccount = await Account.query()
        .patchAndFetchById(accountId, { avatar: result.secure_url })
        .withGraphFetched('roles')
        .select('id', 'name', 'email', 'phone', 'avatar', 'address', 'type', 'isVerified', 'isActive', 'createAt');

      return {
        success: true,
        message: 'Upload avatar thành công',
        data: updatedAccount,
      };
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(accountId: string, passwordData: ChangePasswordData) {
    try {
      const account = await Account.query().findById(accountId);

      if (!account) {
        return {
          success: false,
          message: 'Tài khoản không tồn tại',
        };
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(passwordData.currentPassword, account.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Mật khẩu hiện tại không đúng',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);

      // Update password
      await Account.query().patchAndFetchById(accountId, {
        password: hashedPassword,
      });

      return {
        success: true,
        message: 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Extract Cloudinary public ID from URL
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${publicId}`;
    } catch (error) {
      return null;
    }
  }
}

export default new ProfileService();
