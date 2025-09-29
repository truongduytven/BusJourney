import { z } from "zod";

// Schema for searching tickets
export const searchTicket = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .max(40, "Email ít hơn 40 kí tự")
    .email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải đủ 10 số")
    .max(10, "Số điện thoại không được vượt quá 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số")
    .startsWith("0", "Số điện thoại phải bắt đầu bằng số 0"),
  qrCode: z.string().min(5, "Mã code phải dài ít nhất 5 kí tự"),
});

// Schema for sign in
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .max(40, "Email ít hơn 40 kí tự")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải dài ít nhất 6 kí tự")
    .max(100, "Mật khẩu không được vượt quá 100 kí tự"),
});

// Schema for sign up
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên là bắt buộc")
      .max(50, "Tên không được vượt quá 50 ký tự"),
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .max(50, "Email không được vượt quá 50 ký tự")
      .email("Email không hợp lệ"),
    phone: z
      .string()
      .min(10, "Số điện thoại phải đủ 10 số")
      .max(11, "Số điện thoại không được vượt quá 11 số")
      .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số")
      .startsWith("0", "Số điện thoại phải bắt đầu bằng số 0"),
    password: z
      .string()
      .min(6, "Mật khẩu phải dài ít nhất 6 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải dài ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Schema for OTP verification
export const otpSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  otp: z
    .string()
    .min(6, "Mã OTP phải có 6 chữ số")
    .max(6, "Mã OTP phải có 6 chữ số")
    .regex(/^[0-9]+$/, "Mã OTP chỉ được chứa chữ số"),
});

  // Schema for information checkout 
export const informationCheckoutSchema = z.object({
  fullName: z
    .string()
    .min(5, "Họ và tên là bắt buộc"),
  numberPhone: z
    .string()
    .min(10, "Số điện thoại phải đủ 10 số")
    .max(10, "Số điện thoại không được vượt quá 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số")
    .startsWith("0", "Số điện thoại phải bắt đầu bằng số 0"),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .max(100, "Email không được vượt quá 100 kí tự")
    .email("Email không hợp lệ"),
})

// Schema for partner form
export const partnerSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập tên"),
  company: z.string().min(2, "Vui lòng nhập công ty/tổ chức"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  message: z.string().optional(),
});