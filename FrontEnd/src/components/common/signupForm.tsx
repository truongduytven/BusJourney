import { signUpSchema } from "@/schemas";
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
import { useAppSelector } from "@/redux/hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { City } from "@/types/city";

interface SignupFormProps {
  reset: boolean;
}

export default function SignupForm({ reset }: SignupFormProps) {
  const cities = useAppSelector((state) => state.cities.list) || [];
  const status = useAppSelector((state) => state.cities.status);
  const searchTicketForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (reset) {
      searchTicketForm.reset();
    }
  }, [reset]);

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
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
        <div className="flex flex-col md:flex-row w-full md:w-1/2 gap-4 items-start">
          <FormField
            control={searchTicketForm.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 justify-center items-start w-full md:w-1/2">
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl className="">
                  <Input
                    className="focus-visible:ring-1 border-gray-300"
                    placeholder="Nhập tên của bạn"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={searchTicketForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 justify-center items-start w-full md:w-1/2">
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl className="">
                  <Input
                    className="focus-visible:ring-1 border-gray-300"
                    placeholder="Nhập số điện thoại"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={searchTicketForm.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
              <FormLabel>Địa chỉ</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="">
                  <SelectTrigger className="w-full border border-gray-300 cursor-pointer shadow-none text-sm data-[placeholder]:text-gray-500 focus-visible:ring-1">
                    <SelectValue
                      placeholder={
                        status === "loading" ? "Đang tải..." : "Chọn địa chỉ"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.length > 0 ? (
                    [...cities]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c: City) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                          className="cursor-pointer"
                        >
                          {c.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem disabled value="a">
                      Không có thành phố nào
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row w-full md:w-1/2 gap-4 items-start">
          <FormField
            control={searchTicketForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl className="">
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
            control={searchTicketForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-start w-full md:w-1/2">
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl className="">
                  <PasswordInput
                    className="focus-visible:ring-1"
                    placeholder="Xác nhận mật khẩu"
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
          className="w-full md:w-1/2 mt-6 text-white cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          Đăng ký
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
          Đăng ký bằng Google
        </Button>
      </form>
    </Form>
  );
}
