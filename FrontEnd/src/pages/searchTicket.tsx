import { Button } from "@/components/ui/button";
import {
    Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { searchTicket } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundSearch } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";

export default function SearchTicket() {
  const searchTicketForm = useForm<z.infer<typeof searchTicket>>({
    resolver: zodResolver(searchTicket),
    defaultValues: {
      email: "",
      phone: "",
      qrCode: "",
    },
  });

  const onSubmit = (data: z.infer<typeof searchTicket>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col w-screen items-center justify-center bg-gray-100 px-4 md:px-0 text-center">
      <div className="flex gap-8 w-full md:w-1/3 justify-start flex-col items-center bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="font-bold text-3xl">Tra cứu thông tin vé</h1>
        <Form {...searchTicketForm}>
          <form
            onSubmit={searchTicketForm.handleSubmit(onSubmit)}
            className="flex items-center justify-center gap-5 flex-col text-center w-full"
          >
            <FormField
              control={searchTicketForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-start w-2/3">
                  <FormLabel>Email</FormLabel>
                  <FormControl className="">
                    <Input className="focus-visible:ring-1" placeholder="Nhập email của bạn" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500"/>
                </FormItem>
              )}
            />
            <FormField
              control={searchTicketForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-start w-2/3">
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl className="">
                    <Input className="focus-visible:ring-1" placeholder="Nhập số điện thoại của bạn" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500"/>
                </FormItem>
              )}
            />
            <FormField
              control={searchTicketForm.control}
              name="qrCode"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-start w-2/3">
                  <FormLabel className="text-left">Mã Code</FormLabel>
                  <FormControl className="">
                    <Input className="focus-visible:ring-1" placeholder="Nhập mã code của bạn" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {/* {isError && (
              <div className="flex flex-col justify-center items-center gap-4">
                Đã xảy ra lỗi trong quá trình tra cứu
              </div>
            )} */}

            <Button type="submit" className="w-2/3 mt-6 text-white cursor-pointer transition-transform duration-300 hover:scale-105">
              {/* {isLoading && <Loading />} */}
              <UserRoundSearch className="w-5 mr-2" />
              Tra cứu
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
