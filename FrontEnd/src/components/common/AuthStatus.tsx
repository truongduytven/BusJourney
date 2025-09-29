import { useAppSelector, useAppDispatch } from '@/redux/hook';
import { logout } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';

export default function AuthStatus() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Chào mừng! {user?.name || 'User'}
        </span>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
        >
          Đăng xuất
        </Button>
      </div>
    );
  }

  return null;
}