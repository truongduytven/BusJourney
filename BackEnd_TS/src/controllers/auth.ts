import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Account, { IAccount } from '../models/Accounts';
import { IResetPasswordRequest } from '../types/auth.interface';
import Role from '../models/Role';
import { 
  sendSuccess, 
  sendValidationError, 
  sendUnauthorizedError, 
  sendNotFoundError, 
  handleControllerError,
  sendError 
} from '../utils/responseHelper';
import { validateRequiredFields, isValidPassword, isValidPhone } from '../utils/validationHelper';

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
    const validation = validateRequiredFields({ email, password }, ['email', 'password']);
    if (!validation.isValid) {
      return sendValidationError(res, 'Email và mật khẩu là bắt buộc');
    }

    // Tìm account theo email
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first();

    if (!account) {
      return sendUnauthorizedError(res, 'Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra nếu account đã đăng ký bằng Google
    if (account.type === 'google') {
      return sendError(res, 'Email này đã được đăng ký bằng Google. Vui lòng sử dụng "Đăng nhập với Google".', 400, 'GOOGLE_ACCOUNT_EXISTS');
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    
    if (!isPasswordValid) {
      return sendUnauthorizedError(res, 'Email hoặc mật khẩu không đúng');
    }

    if (!account.isVerified) {
      return sendUnauthorizedError(res, 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.');
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

    return sendSuccess(res, 'Đăng nhập thành công', {
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    return handleControllerError(res, error, 'SignIn');
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validation
    const validation = validateRequiredFields(
      { name, email, phone, password }, 
      ['name', 'email', 'phone', 'password']
    );
    if (!validation.isValid) {
      return sendValidationError(res, 'Tên người dùng, email, số điện thoại và mật khẩu là bắt buộc');
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
      return sendValidationError(res, 'Vai trò không hợp lệ');
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

    return sendSuccess(res, 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực OTP.', {
      accountId: newAccount.id,
      email: newAccount.email,
    }, 201);

  } catch (error) {
    return handleControllerError(res, error, 'SignUp');
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const validation = validateRequiredFields({ email, otp }, ['email', 'otp']);
    if (!validation.isValid) {
      return sendValidationError(res, 'Email và mã OTP là bắt buộc');
    }
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first();

    if (!account) {
      return sendNotFoundError(res, 'Không tìm thấy tài khoản');
    }

    if (account.isVerified) {
      return sendValidationError(res, 'Tài khoản đã được xác thực');
    }

    if (account.otpCode !== otp) {
      return sendValidationError(res, 'Mã OTP không đúng');
    }

    await Account.query()
      .findById(account.id)
      .patch({
        isVerified: true,
        otpCode: ''
      });

    return sendSuccess(res, 'Xác thực OTP thành công. Bạn có thể đăng nhập ngay bây giờ.');
  } catch (error) {
    return handleControllerError(res, error, 'VerifyOtp');
  }
}

export const changePassword = async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
  try {
    const { accountId, currentPassword, newPassword } = req.body;

    // Validation
    const validation = validateRequiredFields(
      { accountId, currentPassword, newPassword }, 
      ['accountId', 'currentPassword', 'newPassword']
    );
    if (!validation.isValid) {
      return sendValidationError(res, 'AccountId, mật khẩu hiện tại và mật khẩu mới là bắt buộc');
    }

    // Validation mật khẩu mới
    if (!isValidPassword(newPassword, 6)) {
      return sendValidationError(res, 'Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    // Tìm account theo ID
    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true);

    if (!account) {
      return sendNotFoundError(res, 'Không tìm thấy tài khoản');
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password);
    
    if (!isCurrentPasswordValid) {
      return sendUnauthorizedError(res, 'Mật khẩu hiện tại không đúng');
    }

    // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, account.password);
    
    if (isSamePassword) {
      return sendValidationError(res, 'Mật khẩu mới không được trùng với mật khẩu hiện tại');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Cập nhật mật khẩu
    await Account.query()
      .findById(accountId)
      .patch({
        password: hashedNewPassword
      });

    return sendSuccess(res, 'Đổi mật khẩu thành công');

  } catch (error) {
    return handleControllerError(res, error, 'ChangePassword');
  }
};

export const resetPasswordByAccountId = async (req: Request<IResetPasswordRequest>, res: Response) => {
  try {
    const { accountId, newPassword } = req.body;
    const validation = validateRequiredFields({ accountId, newPassword }, ['accountId', 'newPassword']);
    if (!validation.isValid) {
      return sendValidationError(res, 'AccountId và mật khẩu mới là bắt buộc');
    }
    if (!isValidPassword(newPassword, 6)) {
      return sendValidationError(res, 'Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true);

    if (!account) {
      return sendNotFoundError(res, 'Không tìm thấy tài khoản');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await Account.query()
      .findById(accountId)
      .patch({
        password: hashedNewPassword
      });

    return sendSuccess(res, 'Reset mật khẩu thành công');

  } catch (error) {
    return handleControllerError(res, error, 'ResetPassword');
  }
};


export const getProfile = async (req: Request, res: Response) => {
  try {
    // Giả sử middleware auth đã set req.user
    const accountId = (req as any).user?.accountId;

    if (!accountId) {
      return sendUnauthorizedError(res, 'Unauthorized');
    }

    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true);

    if (!account) {
      return sendNotFoundError(res, 'Không tìm thấy tài khoản');
    }

    const { password, otpCode, ...accountData } = account;

    return sendSuccess(res, 'Lấy thông tin thành công', accountData);

  } catch (error) {
    return handleControllerError(res, error, 'GetProfile');
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendValidationError(res, 'Email là bắt buộc');
    }

    // Tìm account theo email
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first();

    if (!account) {
      return sendNotFoundError(res, 'Không tìm thấy tài khoản');
    }

    if (account.isVerified) {
      return sendValidationError(res, 'Tài khoản đã được xác thực');
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

    return sendSuccess(res, 'Đã gửi lại mã OTP. Vui lòng kiểm tra email.');

  } catch (error) {
    return handleControllerError(res, error, 'ResendOTP');
  }
};

// Google OAuth Sign In
export const googleSignIn = async (req: Request<{}, {}, GoogleSignInRequest>, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return sendValidationError(res, 'Google credential là bắt buộc');
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return sendUnauthorizedError(res, 'Token Google không hợp lệ');
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return sendValidationError(res, 'Không thể lấy email từ Google');
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

    return sendSuccess(res, 'Đăng nhập Google thành công', {
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    return handleControllerError(res, error, 'Google sign in');
  }
};

// Update phone number for user
export const updatePhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return sendUnauthorizedError(res, 'Token không hợp lệ');
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return sendUnauthorizedError(res, 'Token không hợp lệ hoặc đã hết hạn');
    }

    // Validate phone format
    if (!phone || !isValidPhone(phone)) {
      return sendValidationError(res, 'Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng 0');
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

    return sendSuccess(res, 'Cập nhật số điện thoại thành công');

  } catch (error) {
    return handleControllerError(res, error, 'Update phone');
  }
};
