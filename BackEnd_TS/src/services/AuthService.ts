import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import Account, { IAccount } from '../models/Accounts'
import Role from '../models/Role'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SALT_ROUNDS = 10
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  name: string
  email: string
  phone: string
  password: string
  role?: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ChangePasswordRequest {
  accountId: string
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordRequest {
  accountId: string
  newPassword: string
}

export interface GoogleSignInRequest {
  credential: string
}

export interface UpdatePhoneRequest {
  token: string
  phone: string
}

class AuthService {
  /**
   * Đăng nhập với email và password
   */
  async signIn(data: SignInRequest) {
    const { email, password } = data

    // Tìm account theo email
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first()

    if (!account) {
      return {
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email hoặc mật khẩu không đúng'
      }
    }

    // Kiểm tra nếu account đã đăng ký bằng Google
    if (account.type === 'google') {
      return {
        success: false,
        code: 'GOOGLE_ACCOUNT_EXISTS',
        message: 'Email này đã được đăng ký bằng Google. Vui lòng sử dụng "Đăng nhập với Google".'
      }
    }

    const isPasswordValid = await bcrypt.compare(password, account.password)
    
    if (!isPasswordValid) {
      return {
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email hoặc mật khẩu không đúng'
      }
    }

    if (!account.isVerified) {
      return {
        success: false,
        code: 'NOT_VERIFIED',
        message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.'
      }
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
    )

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        expiresIn: '24h'
      }
    }
  }

  /**
   * Đăng ký tài khoản mới
   */
  async signUp(data: SignUpRequest) {
    const { name, email, phone, password, role } = data

    // Kiểm tra email đã tồn tại
    const existingAccount = await Account.query()
      .where('email', email)
      .first()
    
    if (existingAccount) {
      // Nếu tài khoản đã được xác thực
      if (existingAccount.isVerified) {
        return {
          success: false,
          code: 'EMAIL_EXISTS',
          message: 'Email đã được sử dụng'
        }
      }
      
      // Nếu tài khoản chưa được xác thực, tạo OTP mới
      const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      await Account.query()
        .findById(existingAccount.id)
        .patch({
          otpCode: newOtpCode
        })

      return {
        success: false,
        code: 'ACCOUNT_NOT_VERIFIED',
        message: 'Tài khoản đã đăng ký nhưng chưa xác thực. Mã OTP mới đã được gửi.',
        data: {
          email: existingAccount.email
        }
      }
    }

    const existingRole = await Role.query()
      .where('name', role || 'user')
      .first()
      
    if (!existingRole) {
      return {
        success: false,
        code: 'INVALID_ROLE',
        message: 'Vai trò không hợp lệ'
      }
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
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
    })

    return {
      success: true,
      message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực OTP.',
      data: {
        accountId: newAccount.id,
        email: newAccount.email
      }
    }
  }

  /**
   * Xác thực OTP
   */
  async verifyOtp(data: VerifyOtpRequest) {
    const { email, otp } = data

    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first()

    if (!account) {
      return {
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Không tìm thấy tài khoản'
      }
    }

    if (account.isVerified) {
      return {
        success: false,
        code: 'ALREADY_VERIFIED',
        message: 'Tài khoản đã được xác thực'
      }
    }

    if (account.otpCode !== otp) {
      return {
        success: false,
        code: 'INVALID_OTP',
        message: 'Mã OTP không đúng'
      }
    }

    await Account.query()
      .findById(account.id)
      .patch({
        isVerified: true,
        otpCode: ''
      })

    return {
      success: true,
      message: 'Xác thực OTP thành công. Bạn có thể đăng nhập ngay bây giờ.'
    }
  }

  /**
   * Gửi lại mã OTP
   */
  async resendOTP(email: string) {
    // Tìm account theo email
    const account = await Account.query()
      .where('email', email)
      .where('isActive', true)
      .first()

    if (!account) {
      return {
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Không tìm thấy tài khoản'
      }
    }

    if (account.isVerified) {
      return {
        success: false,
        code: 'ALREADY_VERIFIED',
        message: 'Tài khoản đã được xác thực'
      }
    }

    // Tạo OTP mới
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Cập nhật OTP
    await Account.query()
      .findById(account.id)
      .patch({
        otpCode: newOtpCode
      })

    return {
      success: true,
      message: 'Đã gửi lại mã OTP. Vui lòng kiểm tra email.'
    }
  }

  /**
   * Đăng nhập bằng Google
   */
  async googleSignIn(data: GoogleSignInRequest) {
    const { credential } = data

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return {
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Token Google không hợp lệ'
      }
    }

    const { email, name, picture } = payload

    if (!email) {
      return {
        success: false,
        code: 'NO_EMAIL',
        message: 'Không thể lấy email từ Google'
      }
    }

    // Tìm role customer
    const customerRole = await Role.query().where('name', 'customer').first()
    if (!customerRole) {
      return {
        success: false,
        code: 'ROLE_NOT_FOUND',
        message: 'Không tìm thấy role customer'
      }
    }

    // Kiểm tra account đã tồn tại chưa
    let account = await Account.query()
      .where('email', email)
      .first()

    if (account) {
      // Account đã tồn tại, kiểm tra type
      if (account.type !== 'google') {
        return {
          success: false,
          code: 'EMAIL_EXISTS',
          message: 'Email này đã được đăng ký bằng phương thức khác'
        }
      }
    } else {
      // Tạo account mới với Google
      account = await Account.query().insertAndFetch({
        email,
        name: name || email,
        phone: '',
        avatar: picture || null,
        type: 'google',
        address: '',
        password: '',
        roleId: customerRole.id,
        otpCode: '',
        isVerified: true,
        isActive: true,
        createAt: new Date()
      } as Partial<IAccount>)
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
    )

    return {
      success: true,
      message: 'Đăng nhập Google thành công',
      data: {
        token,
        expiresIn: '24h'
      }
    }
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(data: ChangePasswordRequest) {
    const { accountId, currentPassword, newPassword } = data

    // Validation mật khẩu mới
    if (newPassword.length < 6) {
      return {
        success: false,
        code: 'WEAK_PASSWORD',
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      }
    }

    // Tìm account theo ID
    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true)

    if (!account) {
      return {
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Không tìm thấy tài khoản'
      }
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password)
    
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        code: 'INVALID_PASSWORD',
        message: 'Mật khẩu hiện tại không đúng'
      }
    }

    // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, account.password)
    
    if (isSamePassword) {
      return {
        success: false,
        code: 'SAME_PASSWORD',
        message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
      }
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    // Cập nhật mật khẩu
    await Account.query()
      .findById(accountId)
      .patch({
        password: hashedNewPassword
      })

    return {
      success: true,
      message: 'Đổi mật khẩu thành công'
    }
  }

  /**
   * Reset mật khẩu theo accountId
   */
  async resetPassword(data: ResetPasswordRequest) {
    const { accountId, newPassword } = data

    if (newPassword.length < 6) {
      return {
        success: false,
        code: 'WEAK_PASSWORD',
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      }
    }

    const account = await Account.query()
      .findById(accountId)
      .where('isActive', true)

    if (!account) {
      return {
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Không tìm thấy tài khoản'
      }
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await Account.query()
      .findById(accountId)
      .patch({
        password: hashedNewPassword
      })

    return {
      success: true,
      message: 'Reset mật khẩu thành công'
    }
  }

  /**
   * Lấy thông tin profile
   */
  async getProfile(accountId: string) {
    const account = await Account.query()
      .alias('account')
      .withGraphJoined('[roles]')
      .findById(accountId)
      .where('isActive', true)

    if (!account) {
      return {
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Không tìm thấy tài khoản'
      }
    }

    const { password, otpCode, ...accountData } = account

    return {
      success: true,
      message: 'Lấy thông tin thành công',
      data: accountData
    }
  }

  /**
   * Cập nhật số điện thoại
   */
  async updatePhone(data: UpdatePhoneRequest) {
    const { token, phone } = data

    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return {
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Token không hợp lệ hoặc đã hết hạn'
      }
    }

    // Validate phone format
    if (!phone || !/^0[0-9]{9}$/.test(phone)) {
      return {
        success: false,
        code: 'INVALID_PHONE',
        message: 'Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng 0'
      }
    }

    // Check if phone already exists for another user
    const existingAccount = await Account.query()
      .where('phone', phone)
      .whereNot('id', decoded.accountId)
      .first()

    if (existingAccount) {
      return {
        success: false,
        code: 'PHONE_EXISTS',
        message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác'
      }
    }

    // Update user phone
    await Account.query()
      .findById(decoded.accountId)
      .patch({ phone })

    return {
      success: true,
      message: 'Cập nhật số điện thoại thành công'
    }
  }
}

export default new AuthService()
