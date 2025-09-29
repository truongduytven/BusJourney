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
import googleIcon from "@/assets/google.svg";
import { useEffect } from "react";
import { PasswordInput } from "../ui/password-input";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { signIn, clearError, getProfile } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface SigninFormProps {
  reset: boolean;
}

export default function SigninForm({ reset }: SigninFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

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

  useEffect(() => {
    if (error) {
      // Clear error sau 3 giây
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await dispatch(signIn(data));
      
      if (signIn.fulfilled.match(result)) {
        // Gọi getProfile để lấy thông tin user sau khi đăng nhập thành công
        await dispatch(getProfile());
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <Form {...searchTicketForm}>
      <form
        onSubmit={searchTicketForm.handleSubmit(onSubmit)}
        className="flex items-center justify-center gap-5 flex-col text-center w-full"
      >
        {error && (
          <div className="w-full md:w-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
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
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        <div className="relative w-full md:w-1/2 my-2 text-gray-400">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-400" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-muted-foreground">
              hoặc tiếp tục với
            </span>
          </div>
        </div>
        <Button
          className="w-full md:w-1/2 border-gray-300 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => {}}
          variant="outline"
          type="button"
        >
          <img className="mr-2 w-7 h-7" alt="google" src={googleIcon} />
          Đăng nhập bằng Google
        </Button>
      </form>
    </Form>
  );
}
