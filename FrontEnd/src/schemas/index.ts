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
  username: z
    .string()
    .min(1, "Username là bắt buộc")
    .max(40, "Username ít hơn 40 kí tự"),
  password: z
    .string()
    .min(6, "Mật khẩu phải dài ít nhất 6 kí tự")
    .max(100, "Mật khẩu không được vượt quá 100 kí tự"),
});

// Schema for sign up
export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username là bắt buộc")
      .max(40, "Username ít hơn 40 kí tự"),
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
    address: z
      .string()
      .min(1, "Địa chỉ là bắt buộc")
      .max(100, "Địa chỉ không được vượt quá 100 kí tự"),
    password: z
      .string()
      .min(6, "Mật khẩu phải dài ít nhất 6 kí tự")
      .max(100, "Mật khẩu không được vượt quá 100 kí tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải dài ít nhất 6 kí tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
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