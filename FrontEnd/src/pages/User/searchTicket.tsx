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
import { UserRoundSearch, AlertCircle, Loader, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { lookupTicket } from "@/redux/thunks/ticketThunks";
import {
  clearError,
  clearTicketInfo,
} from "@/redux/slices/ticketSlice";
import TicketResult from "@/components/pages/TicketResult";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export default function SearchTicket() {
  const dispatch = useAppDispatch();
  const { loading, error, ticketInfo } = useAppSelector(
    (state) => state.ticket
  );
  const [open, setOpen] = useState(false);

  const searchTicketForm = useForm<z.infer<typeof searchTicket>>({
    resolver: zodResolver(searchTicket),
    defaultValues: {
      email: "",
      phone: "",
      qrCode: "",
    },
  });

  useEffect(() => {
    dispatch(clearTicketInfo());
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: z.infer<typeof searchTicket>) => {
    try {
      await dispatch(
        lookupTicket({
          email: data.email,
          phone: data.phone,
          ticketCode: data.qrCode,
        })
      ).unwrap();
      setOpen(true);
    } catch (error) {
      console.error("Ticket lookup error:", error);
    }
  };

  return (
    <>
      <div className="pt-10 min-h-screen w-screen flex justify-center items-center bg-[url('@/assets/banner_search_ticket.png')] bg-no-repeat bg-cover px-4 md:px-0">
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <div className="flex gap-8 w-full md:w-1/3 justify-start flex-col items-center bg-white p-10 rounded-2xl shadow-lg">
              <h1 className="font-bold text-3xl text-center">
                Tra cứu thông tin vé
              </h1>
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
                          <Input
                            className="focus-visible:ring-1"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-center items-start w-2/3">
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl className="">
                          <Input
                            className="focus-visible:ring-1"
                            placeholder="Nhập số điện thoại của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
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
                          <Input
                            className="focus-visible:ring-1"
                            placeholder="Nhập mã code của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="flex flex-col justify-center items-center gap-2 w-2/3 my-2">
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 w-full">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Button
                      variant="outline"
                      disabled={loading}
                      onClick={() => {
                        dispatch(clearError());
                        searchTicketForm.reset();
                      }}
                      className="w-2/3 text-primary cursor-pointer transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <RefreshCw className="w-5 mr-2" />
                      Cài lại
                    </Button>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 text-white cursor-pointer transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" />
                        <span className="ml-2">Đang tra cứu...</span>
                      </>
                    ) : (
                      <>
                        <UserRoundSearch className="w-5 mr-2" />
                        Tra cứu
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent className="sm:max-w-4xl h-screen">
          <AlertDialogDescription className="h-full">
            {ticketInfo && <TicketResult ticket={ticketInfo} onClose={() => setOpen(false)} />}
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
