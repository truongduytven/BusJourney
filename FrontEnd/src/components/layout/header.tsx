import LogoFull from "../../assets/logo_full.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Container from "./container";
import {
  AlignRight,
  ClipboardPen,
  LogIn,
  Settings,
  Ticket,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const navItems = [
  { key: "1", label: "Tra cứu vé", navigateName: "/search-ticket" },
  { key: "2", label: "Trở thành đối tác", navigateName: "/become-partner" },
];

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleMyTickets = () => {
    navigate("/my-tickets");
  };

  const handleDashboard = () => {
    navigate("/admin");
  };

  // Component để render user avatar và dropdown
  const UserAvatar = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-gray-300">
            <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none text-green-500">
            <p className="font-medium">{user?.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleProfile}>
          <Settings className="mr-2 h-4 w-4" />
          Chỉnh sửa hồ sơ
        </DropdownMenuItem>
        {user && user.roles.name === "customer" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleMyTickets}
          >
            <Ticket className="mr-2 h-4 w-4" />
            Vé của tôi
          </DropdownMenuItem>
        )}
        {user && user.roles.name === "admin" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleDashboard}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Trang quản trị
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="w-screen shadow-md fixed top-0 z-50 bg-popover">
      <Container>
        <div className="flex justify-between md:justify-center items-center">
          <div className="hidden md:flex flex-1">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="text-primary border-b-3 border-white font-semibold px-4 cursor-pointer pt-6 pb-5 hover:border-secondary hover:text-secondary"
                onClick={() => navigate(item.navigateName)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <Link to="/" className="px-5 py-2 md:flex-1 flex justify-center">
            <img src={LogoFull} alt="Logo" className="h-10 md:h-14 w-auto" />
          </Link>
          <div className="hidden md:flex items-center justify-end px-5 flex-1">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4 ml-10">
                <span className="text-primary font-medium">
                  Xin chào, {user.name}
                </span>
                <UserAvatar />
              </div>
            ) : (
              <div className="flex gap-4 ml-10">
                <Button
                  onClick={() => navigate("/sign?type=signin")}
                  className="text-white bg-secondary hover:bg-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                  size="lg"
                >
                  <LogIn /> Đăng nhập
                </Button>
                <Button
                  onClick={() => navigate("/sign?type=signup")}
                  className="text-secondary bg-transparent border border-secondary hover:bg-transparent hover:text-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                  size="lg"
                >
                  <ClipboardPen /> Đăng ký
                </Button>
              </div>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="mr-10 text-white md:hidden" size="icon">
                <AlignRight />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-white">
              <div className="flex flex-col w-full py-10">
                {navItems.map((item) => (
                  <SheetClose key={item.key}>
                    <div
                      className="text-primary border-b-3 border-white font-semibold px-4 cursor-pointer pt-6 pb-5 hover:border-secondary hover:text-secondary"
                      onClick={() => navigate(item.navigateName)}
                    >
                      {item.label}
                    </div>
                  </SheetClose>
                ))}

                {isAuthenticated && user ? (
                  <SheetClose>
                    <div className="flex flex-col gap-4 px-6 mt-8">
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user?.avatar || ""}
                            alt={user?.name || ""}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleProfile}
                        variant="outline"
                        className="justify-start"
                        size="lg"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Chỉnh sửa hồ sơ
                      </Button>

                      <Button
                        onClick={handleMyTickets}
                        variant="outline"
                        className="justify-start"
                        size="lg"
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        Vé của tôi
                      </Button>

                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="justify-start"
                        size="lg"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </Button>
                    </div>
                  </SheetClose>
                ) : (
                  <SheetClose>
                    <div className="flex flex-col gap-4 px-6 mt-8">
                      <Button
                        onClick={() => navigate("/sign?type=signin")}
                        className="text-white bg-secondary hover:bg-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                        size="lg"
                      >
                        <LogIn /> Đăng nhập
                      </Button>
                      <Button
                        onClick={() => navigate("/sign?type=signup")}
                        className="text-secondary bg-transparent border border-secondary hover:bg-transparent hover:text-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                        size="lg"
                      >
                        <ClipboardPen /> Đăng ký
                      </Button>
                    </div>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
