import { useAppSelector } from "@/redux/hook";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean; // true = cần đăng nhập, false = không được đăng nhập
  redirectTo?: string;   // trang redirect tùy chỉnh
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo 
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    const redirectPath = redirectTo || `/sign?type=signin&returnUrl=${returnUrl}`;
    toast.info("Vui lòng đăng nhập để tiếp tục.");
    return <Navigate to={redirectPath} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    const returnUrl = searchParams.get("returnUrl");
    
    if (returnUrl) {
      return <Navigate to={decodeURIComponent(returnUrl)} replace />;
    }

    const redirectPath = redirectTo || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

// Shorthand components để sử dụng dễ hơn
export const RequireAuth = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>
);

export const RequireGuest = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
);