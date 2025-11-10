import { useAppSelector } from '@/redux/hook'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

export default function RequireUser({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)

  if (!isAuthenticated) {
    toast.info('Vui lòng đăng nhập để tiếp tục.')
    return <Navigate to="/sign?type=signin" replace />
  }

  // Only allow customers to access user-protected routes (customers can buy tickets)
  const role = user?.roles?.name;
  if (role !== 'customer') {
    // Redirect admin to admin area, company to company area, others to home
    if (role === 'admin') {
      toast.error('Quyền truy cập không hợp lệ cho admin')
      return <Navigate to="/admin" replace />
    }

    if (role === 'company') {
      toast.error('Tài khoản Nhà xe không thể thực hiện hành động này')
      return <Navigate to="/company" replace />
    }

    toast.error('Bạn không có quyền truy cập trang này')
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
