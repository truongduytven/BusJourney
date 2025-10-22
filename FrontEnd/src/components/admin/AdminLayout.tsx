import { Outlet, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'

const AdminLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-blue-600">Admin</Link>
            <nav className="space-x-3 text-sm text-gray-600">
              <Link to="/admin" className="hover:underline">Dashboard</Link>
              <Link to="/" className="hover:underline">Back to site</Link>
            </nav>
          </div>
          <div className="text-sm text-gray-700">
            {user ? `Xin chào, ${user.name || user.email}` : 'Not signed in'}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout