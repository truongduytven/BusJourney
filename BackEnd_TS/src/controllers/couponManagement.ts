import { Request, Response } from 'express';
import CouponManagementService from '../services/CouponManagementService';

/**
 * @swagger
 * /api/coupon-management/list:
 *   get:
 *     summary: Get paginated list of coupons
 *     tags: [Coupon Management]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, expired]
 *         description: Filter by coupon status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by coupon description
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: discountType
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *         description: Filter by discount type
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of coupons retrieved successfully
 *       500:
 *         description: Server error
 */
export const getListCoupons = async (req: Request, res: Response) => {
  try {
    const { status, search, companyId, discountType, pageSize, pageNumber } = req.query;

    const filters = {
      status: status as string,
      search: search as string,
      companyId: companyId as string,
      discountType: discountType as string,
      pageSize: pageSize ? parseInt(pageSize as string) : 10,
      pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
    };

    const result = await CouponManagementService.getListCoupons(filters);

    res.status(200).json({
      message: 'Coupons retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving coupons',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/coupon-management/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupon Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon retrieved successfully
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
export const getCouponById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await CouponManagementService.getCouponById(id);

    res.status(200).json({
      message: 'Coupon retrieved successfully',
      data: coupon,
    });
  } catch (error: any) {
    if (error.message === 'Coupon not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error retrieving coupon',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/coupon-management:
 *   post:
 *     summary: Create new coupon
 *     tags: [Coupon Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - discountType
 *               - discountValue
 *               - maxUses
 *               - validFrom
 *               - validTo
 *               - createdBy
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Giảm giá 20% cho khách hàng mới"
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: "percentage"
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               maxDiscountValue:
 *                 type: number
 *                 example: 100000
 *               maxUses:
 *                 type: integer
 *                 example: 100
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-01T00:00:00Z"
 *               validTo:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *               companyId:
 *                 type: string
 *                 example: "uuid-company-id"
 *               createdBy:
 *                 type: string
 *                 example: "uuid-admin-id"
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      description,
      discountType,
      discountValue,
      maxDiscountValue,
      maxUses,
      validFrom,
      validTo,
      status,
      companyId,
      createdBy,
    } = req.body;

    if (!description || !discountType || discountValue === undefined || !maxUses || !validFrom || !validTo || !createdBy) {
      return res.status(400).json({
        message: 'Description, discountType, discountValue, maxUses, validFrom, validTo, and createdBy are required',
      });
    }

    const coupon = await CouponManagementService.createCoupon({
      description,
      discountType,
      discountValue,
      maxDiscountValue,
      maxUses,
      validFrom,
      validTo,
      status,
      companyId,
      createdBy,
    });

    res.status(201).json({
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Error creating coupon',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/coupon-management/{id}:
 *   put:
 *     summary: Update coupon
 *     tags: [Coupon Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               maxDiscountValue:
 *                 type: number
 *               maxUses:
 *                 type: integer
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validTo:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               companyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      description,
      discountType,
      discountValue,
      maxDiscountValue,
      maxUses,
      validFrom,
      validTo,
      status,
      companyId,
    } = req.body;

    const coupon = await CouponManagementService.updateCoupon(id, {
      description,
      discountType,
      discountValue,
      maxDiscountValue,
      maxUses,
      validFrom,
      validTo,
      status,
      companyId,
    });

    res.status(200).json({
      message: 'Coupon updated successfully',
      data: coupon,
    });
  } catch (error: any) {
    if (error.message === 'Coupon not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({
        message: 'Error updating coupon',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/coupon-management/{id}/toggle-status:
 *   patch:
 *     summary: Toggle coupon status (active/inactive)
 *     tags: [Coupon Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon status toggled successfully
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
export const toggleCouponStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await CouponManagementService.toggleCouponStatus(id);

    res.status(200).json({
      message: 'Coupon status toggled successfully',
      data: coupon,
    });
  } catch (error: any) {
    if (error.message === 'Coupon not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error toggling coupon status',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/coupon-management/{id}/extend:
 *   patch:
 *     summary: Extend coupon expiration date
 *     tags: [Coupon Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validTo:
 *                 type: string
 *                 format: date-time
 *                 description: New expiration date
 *             required:
 *               - validTo
 *     responses:
 *       200:
 *         description: Coupon extended successfully
 *       400:
 *         description: Invalid expiration date
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */
export const extendCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { validTo } = req.body;

    if (!validTo) {
      return res.status(400).json({ message: 'New expiration date is required' });
    }

    const coupon = await CouponManagementService.extendCoupon(id, new Date(validTo));

    res.status(200).json({
      message: 'Coupon extended successfully',
      data: coupon,
    });
  } catch (error: any) {
    if (error.message === 'Coupon not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({
        message: 'Error extending coupon',
        error: error.message,
      });
    }
  }
};
