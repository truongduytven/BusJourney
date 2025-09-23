"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ContactImage from "@/assets/Contact.png";
import { toast } from "sonner"
import { Send } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Tên quá ngắn"),
  email: z.string().email("Email không hợp lệ"),
  message: z.string().min(5, "Nội dung quá ngắn"),
})

export default function QuestionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.")
    form.reset()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-5/6 mx-auto mb-20">
      {/* Bên trái: hình ảnh */}
      <div className="hidden md:flex justify-center">
        <img
          src={ContactImage}
          alt="Hỗ trợ khách hàng"
          className="rounded-xl shadow-lg object-cover w-5/6"
        />
      </div>

      {/* Bên phải: Form */}
      <Card className="shadow-xl rounded-2xl border-none">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-primary mb-6 text-center">
            Gửi câu hỏi cho chúng tôi
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Họ tên */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên của bạn"
                        className="text-lg py-3 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        className="text-lg py-3 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nội dung */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nội dung bạn đang thắc mắc
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung..."
                        draggable={false}
                        rows={10}
                        className="text-lg py-3 min-h-[120px] border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:border resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={!form.formState.isValid} type="submit" className="w-full rounded-xl text-lg py-6 text-white">
                Gửi ngay <Send /> 
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
