import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { fetchMyTickets, fetchTicketDetail } from '../redux/thunks/myTicketThunks';
import type { TicketStatusFilter } from '../types/myTicket';

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useMyTickets = () => {
  const dispatch = useAppDispatch();
  const { cache, detailCache, status, pagination, tickets, loading } = useAppSelector(
    (state) => state.myTicket
  );

  /**
   * Check if we should fetch data or use cache
   */
  const shouldFetchTickets = useCallback(
    (targetStatus: TicketStatusFilter, targetPage: number): boolean => {
      const cachedData = cache[targetStatus]?.[targetPage];
      
      if (!cachedData) {
        return true; // No cache, need to fetch
      }
      
      const isCacheExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
      return isCacheExpired; // Fetch if cache expired
    },
    [cache]
  );

  /**
   * Fetch tickets with cache check
   */
  const fetchTicketsWithCache = useCallback(
    (targetStatus?: TicketStatusFilter, targetPage?: number) => {
      const fetchStatus = targetStatus || status;
      const fetchPage = targetPage || pagination.page;

      if (shouldFetchTickets(fetchStatus, fetchPage)) {
        dispatch(
          fetchMyTickets({
            status: fetchStatus,
            page: fetchPage,
            limit: pagination.limit,
          })
        );
      }
    },
    [dispatch, status, pagination, shouldFetchTickets]
  );

  /**
   * Check if we should fetch ticket detail or use cache
   */
  const shouldFetchDetail = useCallback(
    (ticketId: string): boolean => {
      const cachedDetail = detailCache[ticketId];
      
      if (!cachedDetail) {
        return true; // No cache, need to fetch
      }
      
      const isCacheExpired = Date.now() - cachedDetail.timestamp > CACHE_DURATION;
      return isCacheExpired; // Fetch if cache expired
    },
    [detailCache]
  );

  /**
   * Fetch ticket detail with cache check
   */
  const fetchDetailWithCache = useCallback(
    async (ticketId: string) => {
      if (shouldFetchDetail(ticketId)) {
        return await dispatch(fetchTicketDetail(ticketId));
      } else {
        // Return cached data without fetching
        return {
          meta: { requestStatus: 'fulfilled' },
          payload: { data: detailCache[ticketId].data },
        };
      }
    },
    [dispatch, shouldFetchDetail, detailCache]
  );

  return {
    tickets,
    loading,
    shouldFetchTickets,
    fetchTicketsWithCache,
    shouldFetchDetail,
    fetchDetailWithCache,
  };
};
