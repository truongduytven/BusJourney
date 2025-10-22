import { signUpSchema, otpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import type z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useEffect, useState } from "react";
import { PasswordInput } from "../ui/password-input";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import {
  signUp,
  verifyOTP,
  resendOTP,
  clearRegistrationState,
  googleSignIn
} from "@/redux/slices/authSlice";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

interface SignupFormProps {
  reset: boolean;
  setType: (type: string) => void;
}

export default function SignupForm({ reset, setType }: SignupFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, awaitingOTPVerification, registrationEmail } =
    useAppSelector((state) => state.auth);

  const [countdown, setCountdown] = useState(0);

  // Handle Google Sign Up Success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse?.credential) {
        const result = await dispatch(googleSignIn({ 
          credential: credentialResponse.credential 
        }));
        
        if (googleSignIn.fulfilled.match(result)) {
          toast.success("Đăng ký Google thành công!");
          const returnUrl = searchParams.get('returnUrl') || '/';
          navigate(returnUrl);
        } else {
          throw new Error(result.payload as string || 'Google sign up failed');
        }
      }
    } catch (error) {
      console.error("Google sign up error:", error);
      toast.error("Đăng ký Google thất bại!");
    }
  };

  // Handle Google Sign Up Error
  const handleGoogleError = () => {
    console.error("Google sign up failed");
    toast.error("Đăng ký Google thất bại!");
  };

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      email: "",
    },
  });

  useEffect(() => {
    if (reset) {
      signUpForm.reset();
      otpForm.reset({
        otp: "",
        email: "",
      });
      dispatch(clearRegistrationState());
    }
  }, [reset, signUpForm, otpForm, dispatch]);

  // Reset và setup lại OTP form khi chuyển sang OTP mode
  useEffect(() => {
    if (awaitingOTPVerification && registrationEmail) {
      otpForm.reset({
        otp: "",
        email: registrationEmail,
      });
    }
  }, [awaitingOTPVerification, registrationEmail, otpForm]);

  // OTP verification mode tracking handled by Redux state

  // Error handling now done through toast notifications

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSignUpSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const { confirmPassword, ...signUpData } = data;
      const result = await dispatch(
        signUp({ ...signUpData, role: "customer" })
      );

      if (signUp.fulfilled.match(result)) {
        setCountdown(60);
        toast.success(
          "Đăng ký thành công! Mã OTP đã được gửi đến email của bạn."
        );
      } else if (signUp.rejected.match(result)) {
        // Xử lý error từ Redux action
        const errorMessage = result.payload as string;
        if (errorMessage?.includes("ACCOUNT_NOT_VERIFIED")) {
          toast.warning(
            "Tài khoản đã tồn tại nhưng chưa xác thực! Chúng tôi đã gửi mã OTP mới đến email của bạn."
          );
        } else {
          const parsedError = JSON.parse(result.payload || "{}");
          toast.error(parsedError.message || "Đăng ký thất bại!");
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Có lỗi xảy ra khi đăng ký!");
    }
  };

  const onOTPSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      const result = await dispatch(verifyOTP(data));

      if (verifyOTP.fulfilled.match(result)) {
        dispatch(clearRegistrationState());
        toast.success("Xác thực OTP thành công! Bạn đã đăng ký thành công.");
        
        // Kiểm tra returnUrl để redirect về trang trước đó hoặc chuyển sang signin
        const returnUrl = searchParams.get("returnUrl");
        if (returnUrl) {
          // Nếu có returnUrl, chuyển sang signin với returnUrl
          setType("signin");
        } else {
          // Nếu không có returnUrl, chỉ chuyển sang signin
          setType("signin");
        }
      } else if (verifyOTP.rejected.match(result)) {
        const parsedError = JSON.parse(result.payload || "{}");
        toast.error(parsedError.message || "Mã OTP không đúng!");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Có lỗi xảy ra khi xác thực OTP!");
    }
  };

  const handleResendOTP = async () => {
    if (registrationEmail && countdown === 0) {
      try {
        const result = await dispatch(resendOTP({ email: registrationEmail }));

        if (resendOTP.fulfilled.match(result)) {
          setCountdown(60); // Reset countdown
          toast.success("Đã gửi lại mã OTP thành công!");
        } else if (resendOTP.rejected.match(result)) {
          const parsedError = JSON.parse(result.payload || "{}");
          toast.error(parsedError.message || "Gửi lại mã OTP thất bại!");
        }
      } catch (error) {
        console.error("Resend OTP error:", error);
        toast.error("Có lỗi xảy ra khi gửi lại mã OTP!");
      }
    }
  };

  const handleBackToSignUp = () => {
    dispatch(clearRegistrationState());
    otpForm.reset({
      otp: "",
      email: "",
    });
  };

  // Fixed container size to prevent layout shift
  const containerClasses =
    "flex items-center justify-center gap-5 flex-col text-center w-full";

  if (awaitingOTPVerification) {
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onOTPSubmit)}
          className={containerClasses}
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Xác thực OTP</h2>
            <p className="text-gray-600">
              Chúng tôi đã gửi mã xác thực 6 chữ số đến email:
            </p>
            <p className="font-medium text-primary">{registrationEmail}</p>
          </div>

          <Controller
            control={otpForm.control}
            name="otp"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormLabel>Nhập mã OTP</FormLabel>
                  <FormControl>
                    <InputOTP
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white cursor-pointer transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác thực..." : "Xác thực OTP"}
            </Button>

            <div className="text-center space-y-2">
              {countdown > 0 ? (
                <p className="text-gray-500">Gửi lại mã sau {countdown}s</p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-primary hover:underline"
                >
                  Gửi lại mã OTP
                </Button>
              )}

              <Button
                type="button"
                variant="link"
                onClick={handleBackToSignUp}
                className="text-gray-600 hover:underline"
              >
                Quay lại đăng ký
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...signUpForm}>
      <form
        onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
        className={containerClasses}
      >
        <FormField
          control={signUpForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-1 border-gray-300"
                  placeholder="Nhập họ và tên của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={signUpForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-1 border-gray-300"
                  placeholder="Nhập email của bạn"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={signUpForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-1 border-gray-300"
                  placeholder="Nhập số điện thoại của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-between w-1/2 gap-x-2">
          <FormField
            control={signUpForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput
                    className="focus-visible:ring-1"
                    placeholder="Nhập mật khẩu"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={signUpForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput
                    className="focus-visible:ring-1"
                    placeholder="Nhập lại mật khẩu"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-1/2 mt-6 text-white cursor-pointer transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng ký" : "Đăng ký"}{" "}
          {loading && <Loader className="animate-spin" />}
        </Button>

        <div className="relative w-full md:w-1/2 my-2 text-gray-400">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-muted-foreground">
              hoặc tiếp tục với
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/2 transition-transform duration-300 hover:scale-105">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            theme="outline"
            size="large"
            shape="rectangular"
            width="100%"
            locale="vi"
          />
        </div>
      </form>
    </Form>
  );
}
