import { Request, Response } from 'express';
import ReviewService from '../services/ReviewService';

/**
 * Admin Controllers
 */

/**
 * @openapi
 * /api/admin-reviews/list:
 *   get:
 *     summary: Get paginated list of reviews (Admin)
 *     tags: [Admin Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by comment text
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: isVisible
 *         schema:
 *           type: boolean
 *         description: Filter by visibility status
 *       - in: query
 *         name: tripId
 *         schema:
 *           type: string
 *         description: Filter by trip ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
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
 *         description: List of reviews retrieved successfully
 *       500:
 *         description: Server error
 */
export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const { search, rating, isVisible, tripId, userId, pageSize, pageNumber } = req.query;

    const filters = {
      search: search as string,
      rating: rating ? parseInt(rating as string) : undefined,
      isVisible: isVisible === 'true' ? true : isVisible === 'false' ? false : undefined,
      tripId: tripId as string,
      userId: userId as string,
      pageSize: pageSize ? parseInt(pageSize as string) : 10,
      pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
    };

    const result = await ReviewService.getListReviews(filters);

    res.status(200).json({
      message: 'Reviews retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving reviews',
      error: error.message,
    });
  }
};

/**
 * @openapi
 * /api/admin-reviews/{id}:
 *   get:
 *     summary: Get review by ID (Admin)
 *     tags: [Admin Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const getAdminReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await ReviewService.getReviewById(id);

    res.status(200).json({
      message: 'Review retrieved successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error retrieving review',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/admin-reviews/{id}:
 *   put:
 *     summary: Update review (Admin)
 *     tags: [Admin Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commenttext:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const updateAdminReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { commenttext, rating, isVisible } = req.body;

    const review = await ReviewService.updateReview(id, {
      commenttext,
      rating,
      isVisible,
    });

    res.status(200).json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error updating review',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/admin-reviews/{id}:
 *   delete:
 *     summary: Delete review (Admin)
 *     tags: [Admin Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const deleteAdminReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ReviewService.deleteReview(id);

    res.status(200).json({
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error deleting review',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/admin-reviews/{id}/toggle-visibility:
 *   patch:
 *     summary: Toggle review visibility (Admin only)
 *     tags: [Admin Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review visibility toggled successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const toggleAdminReviewVisibility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await ReviewService.toggleVisibility(id);

    res.status(200).json({
      message: 'Review visibility toggled successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error toggling review visibility',
        error: error.message,
      });
    }
  }
};

/**
 * Company Controllers
 */

/**
 * @openapi
 * /api/company-reviews/list:
 *   get:
 *     summary: Get paginated list of reviews (Company)
 *     tags: [Company Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by comment text
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: isVisible
 *         schema:
 *           type: boolean
 *         description: Filter by visibility status
 *       - in: query
 *         name: tripId
 *         schema:
 *           type: string
 *         description: Filter by trip ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
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
 *         description: List of reviews retrieved successfully
 *       500:
 *         description: Server error
 */
export const getCompanyReviews = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user?.companyId;
    const { search, rating, isVisible, tripId, userId, pageSize, pageNumber } = req.query;

    const filters = {
      search: search as string,
      rating: rating ? parseInt(rating as string) : undefined,
      isVisible: isVisible === 'true' ? true : isVisible === 'false' ? false : undefined,
      tripId: tripId as string,
      userId: userId as string,
      pageSize: pageSize ? parseInt(pageSize as string) : 10,
      pageNumber: pageNumber ? parseInt(pageNumber as string) : 1,
      companyId,
    };

    const result = await ReviewService.getListReviews(filters);

    res.status(200).json({
      message: 'Reviews retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error retrieving reviews',
      error: error.message,
    });
  }
};

/**
 * @openapi
 * /api/company-reviews/{id}:
 *   get:
 *     summary: Get review by ID (Company)
 *     tags: [Company Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       403:
 *         description: Review does not belong to this company
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const getCompanyReviewById = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user?.companyId;
    const { id } = req.params;
    const review = await ReviewService.getReviewById(id, companyId);

    res.status(200).json({
      message: 'Review retrieved successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Review does not belong to this company') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error retrieving review',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/company-reviews/{id}:
 *   put:
 *     summary: Update review (Company - cannot change visibility)
 *     tags: [Company Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commenttext:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Review does not belong to this company
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const updateCompanyReview = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user?.companyId;
    const { id } = req.params;
    const { commenttext, rating } = req.body;

    // Company cannot update isVisible
    const review = await ReviewService.updateReview(id, {
      commenttext,
      rating,
    }, companyId);

    res.status(200).json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Review does not belong to this company') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error updating review',
        error: error.message,
      });
    }
  }
};

/**
 * @openapi
 * /api/company-reviews/{id}:
 *   delete:
 *     summary: Delete review (Company)
 *     tags: [Company Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Review does not belong to this company
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
export const deleteCompanyReview = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user?.companyId;
    const { id } = req.params;
    await ReviewService.deleteReview(id, companyId);

    res.status(200).json({
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Review not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Review does not belong to this company') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Error deleting review',
        error: error.message,
      });
    }
  }
};
