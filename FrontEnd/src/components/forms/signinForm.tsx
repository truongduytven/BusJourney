import { signInSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import { useEffect } from "react";
import { PasswordInput } from "../ui/password-input";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { signIn, getProfile, googleSignIn } from "@/redux/slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

interface SigninFormProps {
  reset: boolean;
}

export default function SigninForm({ reset }: SigninFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading } = useAppSelector((state) => state.auth);

  // Handle Google Sign In Success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      try {
        const result = await dispatch(googleSignIn({ 
          credential: credentialResponse.credential 
        }));
        
        if (googleSignIn.fulfilled.match(result)) {
          toast.success("Đăng nhập Google thành công!");
          // Lấy profile và redirect theo role
          const profile = await dispatch(getProfile()).unwrap();
          const returnUrl = searchParams.get("returnUrl");
          const isAdmin = profile && (profile.role === 'admin' || profile.roleId === '1' || profile.roles?.some((r: any) => r.name === 'admin'));
          if (isAdmin) {
            navigate('/admin', { replace: true });
          } else if (returnUrl) {
            navigate(decodeURIComponent(returnUrl), { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error("Google sign in error:", error);
        toast.error("Đăng nhập Google thất bại!");
      }
    }
  };

  // Handle Google Sign In Error
  const handleGoogleError = () => {
    console.error("Google sign in failed");
    toast.error("Đăng nhập Google thất bại!");
  };

  const searchTicketForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (reset) {
      searchTicketForm.reset();
    }
  }, [reset, searchTicketForm]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await dispatch(signIn(data));
      
      if (signIn.fulfilled.match(result)) {
        toast.success("Đăng nhập thành công!");
        // Lấy profile để biết role và redirect hợp lý
        const profile = await dispatch(getProfile()).unwrap();
        const returnUrl = searchParams.get('returnUrl');
        const isAdmin = profile && (profile.roles.name === 'admin');
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate(returnUrl || '/', { replace: true });
        }
      } else {
        // Xử lý lỗi từ backend
        const errorPayload = result.payload as any;
        if (errorPayload?.code === 'GOOGLE_ACCOUNT_EXISTS') {
          toast.error("Email này đã được đăng ký bằng Google. Vui lòng sử dụng nút 'Đăng nhập với Google' bên dưới.", {
            duration: 5000,
          });
        } else {
          toast.error(errorPayload?.message || "Đăng nhập thất bại!");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra khi đăng nhập!");
    }
  };
  return (
    <Form {...searchTicketForm}>
      <form
        onSubmit={searchTicketForm.handleSubmit(onSubmit)}
        className="flex items-center justify-center gap-5 flex-col text-center w-full"
      >
        <FormField
          control={searchTicketForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
              <FormLabel>Email</FormLabel>
              <FormControl className="">
                <Input
                  className="focus-visible:ring-1 border-gray-300"
                  placeholder="Nhập email của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={searchTicketForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl className="">
                <PasswordInput
                  className="focus-visible:ring-1"
                  placeholder="Nhập mật khẩu của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-1/2 mt-6 text-white cursor-pointer transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng nhập" : "Đăng nhập"} {loading && <Loader className="animate-spin"/>}
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
            text="signin_with"
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
