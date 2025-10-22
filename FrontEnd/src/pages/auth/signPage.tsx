import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SignUpImage from "@/assets/signup_img.png";
import SignInImage from "@/assets/signin_img.png";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SigninForm from "@/components/forms/signinForm";
import SignupForm from "@/components/forms/signupForm";
import { useAppDispatch } from "@/redux/hook";
import { fetchCities } from "@/redux/thunks/cityThunks";
import { House } from "lucide-react";

export default function SignPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const typeChecked =
    searchParams.get("type") === "signin" ? "signin" : "signup";
  const [type, setType] = useState<string>(typeChecked);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const handleChangeType = (newType: string) => {
    setType(newType);
    setSearchParams({ type: newType }, { replace: true });
  };

  return (
    <div className="w-screen h-screen relative flex justify-center items-center">
      <div className="absolute inset-0 bg-[url('@/assets/banner_sign.png')] bg-no-repeat bg-center md:bg-cover opacity-85"></div>
      <div className="flex absolute top-4 left-4 md:top-8 md:left-8 text-white bg-black/30 rounded-full py-2 px-4 items-center hover:bg-black/50 transition cursor-pointer" onClick={() => window.location.href = "/"}>
         Về trang chủ <House size={20} className="ml-2" />
      </div>
      <div
        className={`relative bg-white w-[95%] md:w-3/4 h-full md:h-3/4 rounded-2xl shadow-lg flex flex-col md:flex-row ${
          type === "signin" ? "justify-center md:justify-end" : "justify-center md:justify-start"
        } items-center gap-8 p-4 md:p-8`}
      >
        <motion.img
          key={type}
          src={type === "signin" ? SignInImage : SignUpImage}
          alt={type === "signin" ? "Sign In" : "Sign Up"}
          className="hidden lg:block absolute z-10 h-full rounded-2xl shadow-lg left-0"
          initial={{ x: type === "signin" ? "94%" : 0, opacity: 0 }}
          animate={{ x: type === "signin" ? 0 : "94%", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        {/* Đăng ký Section */}
        {type === "signup" && (
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-0"
            key={1}
            initial={{ x: "94%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="w-full flex flex-col justify-center items-center gap-y-12">
              <div className="flex justify-center items-center gap-x-4">
                <div className="text-2xl text-gray-300">Đăng nhập</div>
                <Switch
                  id="sign"
                  checked={type === "signup"}
                  onCheckedChange={(checked) =>
                    handleChangeType(checked ? "signup" : "signin")
                  }
                />
                <div
                  className={cn("text-2xl text-gray-300", {
                    "font-bold text-primary": type === "signup",
                  })}
                >
                  Đăng ký
                </div>
              </div>
              <SignupForm reset={false} setType={setType} />
            </div>
          </motion.div>
        )}
        {/* Đăng nhập Section */}
        {type === "signin" && (
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-0"
            key={2}
            initial={{ x: "-94%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="w-full flex flex-col justify-center items-center gap-y-12">
              <div className="flex justify-center items-center gap-x-4">
                <div
                  className={cn("text-2xl text-gray-300", {
                    "font-bold text-primary": type === "signin",
                  })}
                >
                  Đăng nhập
                </div>
                <Switch
                  id="sign"
                  checked={false}
                  onCheckedChange={(checked) =>
                    handleChangeType(checked ? "signup" : "signin")
                  }
                />
                <div className="text-2xl text-gray-300">Đăng ký</div>
              </div>
              <SigninForm reset={false} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
