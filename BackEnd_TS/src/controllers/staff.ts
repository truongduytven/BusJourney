import { Request, Response } from 'express';
import StaffService from '../services/StaffService';

/**
 * @swagger
 * /api/company/staff/list:
 *   get:
 *     summary: Get paginated list of staff for a company
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
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
 *         description: List of staff retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getListStaff = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        message: 'Company ID not found in user session',
      });
    }

    const { search, isActive, pageSize, pageNumber } = req.query;

    const filters = {
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : 10,
      pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
    };

    const result = await StaffService.getStaffList(companyId, filters);

    res.status(200).json({
      message: 'Staff list retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving staff list',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/company/staff/{id}:
 *   get:
 *     summary: Get staff by ID
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff retrieved successfully
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Server error
 */
export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        message: 'Company ID not found in user session',
      });
    }

    const staff = await StaffService.getStaffById(id, companyId);

    res.status(200).json({
      message: 'Staff retrieved successfully',
      data: staff,
    });
  } catch (error: any) {
    if (error.message === 'Staff not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error retrieving staff',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/company/staff:
 *   post:
 *     summary: Create new staff account
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "staff@example.com"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const createStaff = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const createdBy = req.user?.accountId;
    
    if (!companyId) {
      return res.status(400).json({
        message: 'Company ID not found in user session',
      });
    }

    if (!createdBy) {
      return res.status(400).json({
        message: 'Staffs ID not found in session',
      });
    }

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'Name, email, phone, and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    // Validate phone format (Vietnamese phone numbers)
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: 'Invalid phone number format',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const staff = await StaffService.createStaff({
      name,
      email,
      phone,
      password,
      companyId,
      createdBy,
    });

    res.status(201).json({
      message: 'Staff created successfully',
      data: staff,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Error creating staff',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/company/staff/{id}:
 *   put:
 *     summary: Update staff information
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Server error
 */
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        message: 'Company ID not found in user session',
      });
    }

    const { name, email, phone, password } = req.body;

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Invalid email format',
        });
      }
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: 'Invalid phone number format',
        });
      }
    }

    // Validate password length if provided
    if (password && password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const staff = await StaffService.updateStaff(id, companyId, {
      name,
      email,
      phone,
      password,
      companyId,
      createdBy: req.user?.accountId || '',
    });

    res.status(200).json({
      message: 'Staff updated successfully',
      data: staff,
    });
  } catch (error: any) {
    if (error.message === 'Staff not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({
        message: 'Error updating staff',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/company/staff/{id}/toggle-status:
 *   patch:
 *     summary: Toggle staff active status
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff status toggled successfully
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Server error
 */
export const toggleStaffStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        message: 'Company ID not found in user session',
      });
    }

    const staff = await StaffService.toggleStaffStatus(id, companyId);

    res.status(200).json({
      message: 'Staff status toggled successfully',
      data: staff,
    });
  } catch (error: any) {
    if (error.message === 'Staff not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error toggling staff status',
        error: error.message,
      });
    }
  }
};

/**
 * @swagger
 * /api/company/staff/bulk-toggle-active:
 *   put:
 *     summary: Bulk toggle staff active status
 *     tags: [Staffs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffIds
 *               - isActive
 *             properties:
 *               staffIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of staff IDs to update
 *               isActive:
 *                 type: boolean
 *                 description: New active status
 *     responses:
 *       200:
 *         description: Staff statuses toggled successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export const bulkToggleActive = async (req: Request, res: Response) => {
  try {
    const { staffIds, isActive } = req.body;
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: 'Company ID not found in user session',
      });
    }

    if (!Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({
        message: 'staffIds must be a non-empty array',
      });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        message: 'isActive must be a boolean',
      });
    }

    const updatedCount = await StaffService.bulkToggleActive(
      staffIds,
      isActive,
      companyId
    );

    res.status(200).json({
      message: `Successfully updated ${updatedCount} staff member(s)`,
      data: {
        updatedCount,
        isActive,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error bulk toggling staff status',
      error: error.message,
    });
  }
};
