import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Account from '../models/Accounts';
import { IResetPasswordRequest } from '../types/auth.interface';
import Role from '../models/Role';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;
// Interface cho request body
interface SignInRequest {
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  accountId: string;
  currentPassword: string;
  newPassword: string;
}


export const signIn = async (req: Request<{}, {}, SignInRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Tìm account theo email
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first();

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    if (!account.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        accountId: account.id,
        email: account.email,
        roleId: account.roleId,
        companyId: account.companyId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('SignIn error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng, email, số điện thoại, địa chỉ và mật khẩu là bắt buộc'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingAccount = await Account.query()
      .where('email', email)
      .first();
    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    const existingRole = await Role.query()
      .where('name', role || 'user')
      .first();
    if (!existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ'
      });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Tạo account mới
    const newAccount = await Account.query().insert({
      name,
      email,
      phone,
      address,
      avatar: avatarUrl,
      password: hashedPassword,
      type: 'normal',
      roleId: existingRole.id,
      isVerified: false,
      isActive: true,
      otpCode: otp,
      createAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực OTP.',
      data: {
        accountId: newAccount.id,
        email: newAccount.email,
      }
    });

  } catch (error) {
    console.error('SignUp error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email và mã OTP là bắt buộc'
      });
    }
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first();

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    if (account.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã được xác thực'
      });
    }

    if (account.otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không đúng'
      });
    }

    await Account.query()
      .findById(account.id)
      .patch({
        isVerified: true,
        otpCode: ''
      });

    return res.status(200).json({
      success: true,
      message: 'Xác thực OTP thành công. Bạn có thể đăng nhập ngay bây giờ.'
    }); 
  } catch (error) {
    console.error('VerifyOtp error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const changePassword = async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
  try {
    const { accountId, currentPassword, newPassword } = req.body;

    // Validation
    if (!accountId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'AccountId, mật khẩu hiện tại và mật khẩu mới là bắt buộc'
      });
    }

    // Validation mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Tìm account theo ID
    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, account.password);
    
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
      });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Cập nhật mật khẩu
    await Account.query()
      .findById(accountId)
      .patch({
        password: hashedNewPassword
      });

    return res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('ChangePassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const resetPasswordByAccountId = async (req: Request<IResetPasswordRequest>, res: Response) => {
  try {
    const { accountId, newPassword } = req.body;
    if (!accountId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'AccountId và mật khẩu mới là bắt buộc'
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }
    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await Account.query()
      .findById(accountId)
      .patch({
        password: hashedNewPassword
      });

    return res.status(200).json({
      success: true,
      message: 'Reset mật khẩu thành công'
    });

  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


export const getProfile = async (req: Request, res: Response) => {
  try {
    // Giả sử middleware auth đã set req.user
    const accountId = (req as any).user?.accountId;

    if (!accountId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    const { password, otpCode, ...accountData } = account;

    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin thành công',
      data: accountData
    });

  } catch (error) {
    console.error('GetProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
