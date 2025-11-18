import { Router } from 'express';
import { CompanyTripController } from '../controllers/companyTrip';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/company', authenticateToken, CompanyTripController.companyListTrips);
router.get('/company/:id', authenticateToken, CompanyTripController.companyGetTrip);
router.post('/company', authenticateToken, CompanyTripController.companyCreateTrip);
router.post('/company/bulk', authenticateToken, CompanyTripController.companyCreateBulkTrips);
router.put('/company/:id', authenticateToken, CompanyTripController.companyUpdateTrip);
router.put('/company/bulk-toggle', authenticateToken, CompanyTripController.companyBulkToggleTrip);
router.put('/company/:id/toggle', authenticateToken, CompanyTripController.companyToggleTrip);

export default router;
