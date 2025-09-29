import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { informationCheckoutSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useEffect } from "react";

interface InformationCheckoutFormProps {
    onSubmit: (data: z.infer<typeof informationCheckoutSchema>) => void;
    user?: any; // User data để auto-fill form
}

export default function InformationCheckoutForm({ onSubmit, user }: InformationCheckoutFormProps) {
  const infomationCheckoutForm = useForm<
    z.infer<typeof informationCheckoutSchema>
  >({
    resolver: zodResolver(informationCheckoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      numberPhone: user?.phone || "",
      email: user?.email || "",
    },
  });

  // Auto-fill form khi user data được load
  useEffect(() => {
    if (user) {
      infomationCheckoutForm.setValue("fullName", user.name || "");
      infomationCheckoutForm.setValue("numberPhone", user.phone || "");
      infomationCheckoutForm.setValue("email", user.email || "");
    }
  }, [user, infomationCheckoutForm]);

  return (
    <Form {...infomationCheckoutForm}>
      <form
        id="checkout-form"
        className="mt-4 w-full flex flex-col gap-4"
        onSubmit={infomationCheckoutForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={infomationCheckoutForm.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full">
              <FormLabel className="text-base">
                Tên người đi <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl className="">
                <Input
                  className="h-auto focus-visible:ring-1 border-gray-300 text-base py-3 px-4"
                  placeholder="Nhập tên người đi"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={infomationCheckoutForm.control}
          name="numberPhone"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full">
              <FormLabel className="text-base">
                Số điện thoại <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl className="">
                <Input
                  className="h-auto focus-visible:ring-1 border-gray-300 text-base py-3 px-4"
                  placeholder="Nhập số điện thoại"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={infomationCheckoutForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-start w-full">
              <FormLabel className="text-base">
                Email<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl className="">
                <Input
                  className="h-auto focus-visible:ring-1 border-gray-300 text-base py-3 px-4"
                  placeholder="Nhập email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
