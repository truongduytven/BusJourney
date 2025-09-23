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

interface InformationCheckoutFormProps {
    onSubmit: (data: z.infer<typeof informationCheckoutSchema>) => void;
}

export default function InformationCheckoutForm({ onSubmit }: InformationCheckoutFormProps) {
    const infomationCheckout = localStorage.getItem("checkoutInfo");
  const infomationCheckoutForm = useForm<
    z.infer<typeof informationCheckoutSchema>
  >({
    resolver: zodResolver(informationCheckoutSchema),
    defaultValues: {
      fullName: infomationCheckout ? JSON.parse(infomationCheckout).fullName : "",
      numberPhone: infomationCheckout ? JSON.parse(infomationCheckout).numberPhone : "",
      email: infomationCheckout ? JSON.parse(infomationCheckout).email : "",
    },
  });

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
