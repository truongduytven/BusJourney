import { Router } from 'express';
import { CompanyTemplateController } from '../controllers/companyTemplate';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Company Templates
 *   description: Company template search and management endpoints
 */ 

router.get('/company', authenticateToken, CompanyTemplateController.companyListTemplates);
router.get('/company/:id', authenticateToken, CompanyTemplateController.companyGetTemplate);
router.post('/company', authenticateToken, CompanyTemplateController.companyCreateTemplate);
router.put('/company/:id', authenticateToken, CompanyTemplateController.companyUpdateTemplate);
router.put('/company/bulk-toggle', authenticateToken, CompanyTemplateController.companyBulkToggleTemplate);
router.put('/company/:id/toggle', authenticateToken, CompanyTemplateController.companyToggleTemplate);

export default router;
