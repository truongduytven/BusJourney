import { Request, Response } from 'express';
import HomeService from '../services/HomeService';

class HomeController {
  /**
   * @openapi
   * /home/featured-routes:
   *   get:
   *     summary: Get featured routes
   *     tags: [Home]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 6
   *         description: Number of routes to return
   *     responses:
   *       200:
   *         description: Success
   */
  async getFeaturedRoutes(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const result = await HomeService.getFeaturedRoutes(limit);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Get featured routes error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @openapi
   * /home/active-coupons:
   *   get:
   *     summary: Get active coupons
   *     tags: [Home]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 6
   *         description: Number of coupons to return
   *     responses:
   *       200:
   *         description: Success
   */
  async getActiveCoupons(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const result = await HomeService.getActiveCoupons(limit);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Get active coupons error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @openapi
   * /home/featured-reviews:
   *   get:
   *     summary: Get featured reviews
   *     tags: [Home]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of reviews to return
   *     responses:
   *       200:
   *         description: Success
   */
  async getFeaturedReviews(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await HomeService.getFeaturedReviews(limit);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Get featured reviews error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new HomeController();
