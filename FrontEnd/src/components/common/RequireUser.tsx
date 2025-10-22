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

  const isAdmin = user && (user.roles.name === 'admin')
  if (isAdmin) {
    toast.error('Quyền truy cập không hợp lệ cho admin')
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
