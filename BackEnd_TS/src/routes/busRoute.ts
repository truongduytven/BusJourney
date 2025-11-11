import express from 'express';
import { authenticateToken, requireCompany } from '../middlewares/authMiddleware';
import {
  listBusRoutes,
  getBusRoute,
  createBusRoute,
  updateBusRouteStatus,
  deleteBusRoute,
  getApprovedRoutes,
} from '../controllers/busRoute';

const router = express.Router();

// Tất cả routes cần authentication và company role
router.use(authenticateToken);
router.use(requireCompany);

// GET /bus-routes/approved-routes - Lấy danh sách routes đã duyệt để chọn
router.get('/approved-routes', getApprovedRoutes);

// GET /bus-routes - Lấy danh sách bus routes của company
router.get('/', listBusRoutes);

// GET /bus-routes/:id - Chi tiết bus route
router.get('/:id', getBusRoute);

// POST /bus-routes - Tạo bus route mới (chọn từ routes đã duyệt)
router.post('/', createBusRoute);

// PATCH /bus-routes/:id/status - Cập nhật status (active/inactive)
router.patch('/:id/status', updateBusRouteStatus);

// DELETE /bus-routes/:id - Xóa bus route
router.delete('/:id', deleteBusRoute);

export default router;
