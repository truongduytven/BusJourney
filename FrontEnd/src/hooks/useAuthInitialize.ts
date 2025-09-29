import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getProfile } from '@/redux/slices/authSlice';

export const useAuthInitialize = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Nếu có token nhưng chưa có thông tin user, gọi getProfile
    if (isAuthenticated && token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, token, user]);

  return { isAuthenticated, user };
};