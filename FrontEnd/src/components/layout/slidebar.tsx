"use client";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  CircleUserRound,
  PanelRightOpen,
  PanelLeftOpen,
  SquareUser,
  Building2,
  LocateFixed,
  MapPin,
  MapPinned,
  Tag,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import LogoFull from "@/assets/logo_full.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface MenuChild {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: MenuChild[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Người dùng",
    icon: SquareUser,
    path: "/admin/users",
  },
  {
    label: "Vị trí",
    icon: MapPinned,
    children: [
      { label: "Thành phố", icon: Building2, path: "/admin/cities" },
      { label: "Địa điểm", icon: LocateFixed, path: "/admin/locations" },
      { label: "Điểm đón/trả", icon: MapPin, path: "/admin/points" },
    ],
  },
  {
    label: "Mã giảm giá",
    icon: Tag,
    path: "/admin/coupons",
  },
  {
    label: "Đối tác",
    icon: Handshake,
    path: "/admin/partners",
  },
  {
    label: "Cài đặt",
    icon: Settings,
    path: "/admin/settings",
  },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Tự động mở menu chứa trang hiện tại khi load/reload
  useEffect(() => {
    const currentPath = location.pathname;

    // Tìm menu cha có chứa đường dẫn hiện tại
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          currentPath.includes(child.path)
        );

        if (hasActiveChild && !openMenus.includes(item.label)) {
          setOpenMenus((prev) => [...prev, item.label]);
        }
      }
    });
  }, [location.pathname]);

  const handleToggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  const renderMenu = () => (
    <nav className="flex flex-col space-y-2 mt-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isOpen = openMenus.includes(item.label);
        const isActive = item.path && location.pathname.endsWith(item.path);

        return (
          <div key={item.label}>
            {/* Menu cha */}
            <Button
              variant="ghost"
              className={cn(
                "px-3 justify-between w-full h-12 text-base font-semibold rounded-xl transition-all duration-200",
                "hover:bg-gray-200 hover:text-primary",
                isActive &&
                  "bg-primary text-white hover:bg-primary hover:text-white"
              )}
              onClick={() =>
                item.children
                  ? handleToggleMenu(item.label)
                  : navigate(item.path || "#")
              }
            >
              <div className="flex items-center">
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-white" : "text-primary"
                  )}
                />
                {!collapsed && item.label}
              </div>
              {!collapsed &&
                item.children &&
                (isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ))}
            </Button>

            {/* Submenu có animation */}
            <AnimatePresence initial={false}>
              {!collapsed && item.children && isOpen && (
                <motion.div
                  key={item.label}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="ml-8 mt-1 space-y-1 overflow-hidden"
                >
                  {item.children.map((child) => {
                    const activeChild = location.pathname.endsWith(child.path);
                    const MenuIcon = child.icon;
                    return (
                      <Button
                        key={child.path}
                        variant="ghost"
                        className={cn(
                          "justify-start w-full h-11 text-sm rounded-lg font-medium transition-all duration-200",
                          "hover:bg-gray-200 hover:text-primary",
                          activeChild &&
                            "bg-primary text-white hover:bg-primary hover:text-white"
                        )}
                        onClick={() => navigate(child.path)}
                      >
                        <div className="flex items-center">
                          <MenuIcon
                            className={cn(
                              "mr-3 h-5 w-5",
                              activeChild ? "text-white" : "text-primary"
                            )}
                          />
                          {!collapsed && child.label}
                        </div>
                      </Button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-gray-200 bg-white p-4 shadow-sm overflow-hidden"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between mb-5",
            collapsed && "justify-center"
          )}
        >
          {!collapsed && <img src={LogoFull} alt="Logo" className="h-9" />}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/50 hover:text-white transition-all duration-200"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelRightOpen className="h-5 w-5" />
            )}
          </Button>
        </div>

        {renderMenu()}

        <div className="flex flex-1 flex-col gap-y-3 justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="justify-between items-center w-full h-14 text-sm rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 hover:text-primary"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium text-xs text-gray-400">
                    {user && user.roles.name === "admin"
                      ? "Quản trị viên"
                      : "Nhà xe"}
                  </span>
                  <span className="text-muted-foreground truncate text-sm">
                    {user && user.name}
                  </span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={"right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/admin/profile");
                  }}
                >
                  <CircleUserRound />
                  Thông tin tài khoản
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Sidebar Mobile (trượt ra từ trái) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-primary text-primary hover:bg-primary/50 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="text-lg font-bold text-primary mb-4">
              Trang Quản Trị
            </div>
            {renderMenu()}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AdminSidebar;
