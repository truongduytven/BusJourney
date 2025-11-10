import { useAppSelector } from '@/redux/hook'
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

export default function RequireCompany({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search)
    toast.info('Vui lòng đăng nhập để truy cập trang Nhà xe')
    return <Navigate to={`/sign?type=signin&returnUrl=${returnUrl}`} replace />
  }

  const isCompany = user && (user.roles.name === 'company')

  if(isCompany === null) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  }

  if (isCompany === false) {
    // If not company, redirect appropriately
    if (user && user.roles?.name === 'admin') {
      toast.error('Quyền truy cập không hợp lệ cho quản trị viên')
      return <Navigate to="/admin" replace />
    }

    toast.error('Bạn không có quyền truy cập trang này')
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
