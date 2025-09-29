import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Account, { IAccount } from '../models/Accounts';
import { IResetPasswordRequest } from '../types/auth.interface';
import Role from '../models/Role';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Google OAuth Client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Interface cho request body
interface SignInRequest {
  email: string;
  password: string;
}

interface GoogleSignInRequest {
  credential: string; // Google JWT token
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

    // Kiểm tra nếu account đã đăng ký bằng Google
    if (account.type === 'google') {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký bằng Google. Vui lòng sử dụng "Đăng nhập với Google".',
        code: 'GOOGLE_ACCOUNT_EXISTS'
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
    const { name, email, phone, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng, email, số điện thoại và mật khẩu là bắt buộc'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingAccount = await Account.query()
      .where('email', email)
      .first();
    
    if (existingAccount) {
      // Nếu tài khoản đã được xác thực
      if (existingAccount.isVerified) {
        return res.status(409).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }
      
      // Nếu tài khoản chưa được xác thực, tạo OTP mới
      const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await Account.query()
        .findById(existingAccount.id)
        .patch({
          otpCode: newOtpCode
        });

      // TODO: Gửi OTP mới qua email
      console.log(`OTP mới cho email ${email}: ${newOtpCode}`);

      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã đăng ký nhưng chưa xác thực. Mã OTP mới đã được gửi.',
        code: 'ACCOUNT_NOT_VERIFIED',
        data: {
          email: existingAccount.email
        }
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
      address: '',
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

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    // Tìm account theo email
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

    // Tạo OTP mới
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Cập nhật OTP
    await Account.query()
      .findById(account.id)
      .patch({
        otpCode: newOtpCode
      });

    // TODO: Gửi OTP qua email
    console.log(`OTP mới cho email ${email}: ${newOtpCode}`);

    return res.status(200).json({
      success: true,
      message: 'Đã gửi lại mã OTP. Vui lòng kiểm tra email.',
    });

  } catch (error) {
    console.error('ResendOTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Google OAuth Sign In
export const googleSignIn = async (req: Request<{}, {}, GoogleSignInRequest>, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential là bắt buộc'
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Token Google không hợp lệ'
      });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Không thể lấy email từ Google'
      });
    }

    // Tìm role customer
    const customerRole = await Role.query().where('name', 'customer').first();
    if (!customerRole) {
      return res.status(500).json({
        success: false,
        message: 'Không tìm thấy role customer'
      });
    }

    // Kiểm tra account đã tồn tại chưa
    let account = await Account.query()
      .where('email', email)
      .first();

    if (account) {
      // Account đã tồn tại, cập nhật thông tin Google nếu cần
      if (account.type !== 'google') {
        // Account tồn tại nhưng không phải Google account
        return res.status(409).json({
          success: false,
          message: 'Email này đã được đăng ký bằng phương thức khác'
        });
      }
    } else {
      // Tạo account mới với Google
      account = await Account.query().insertAndFetch({
        email,
        name: name || email,
        phone: '', // Google không cung cấp phone
        avatar: picture || null,
        type: 'google',
        address: '',
        password: '', // Google account không cần password
        roleId: customerRole.id,
        otpCode: '',
        isVerified: true, // Google account không cần verify OTP
        isActive: true,
        createAt: new Date()
      } as Partial<IAccount>);
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        accountId: account.id, 
        email: account.email, 
        roleId: account.roleId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập Google thành công',
      data: {
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('Google sign in error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập Google'
    });
  }
};

// Update phone number for user
export const updatePhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Validate phone format
    if (!phone || !/^0[0-9]{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng 0'
      });
    }

    // Check if phone already exists for another user
    const existingAccount = await Account.query()
      .where('phone', phone)
      .whereNot('id', decoded.accountId)
      .first();

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác'
      });
    }

    // Update user phone
    await Account.query()
      .findById(decoded.accountId)
      .patch({ phone });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật số điện thoại thành công'
    });

  } catch (error) {
    console.error('Update phone error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật số điện thoại'
    });
  }
};
