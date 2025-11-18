import Review from '../models/Reviews';

interface ReviewListFilters {
  search?: string;
  rating?: number;
  isVisible?: boolean;
  tripId?: string;
  userId?: string;
  pageSize?: number;
  pageNumber?: number;
  companyId?: string;
}

interface ReviewListResponse {
  reviews: Review[];
  totalReviews: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

class ReviewService {
  /**
   * Get paginated list of reviews with filters
   */
  async getListReviews(filters: ReviewListFilters): Promise<ReviewListResponse> {
    const {
      search,
      rating,
      isVisible,
      tripId,
      userId,
      pageSize = 10,
      pageNumber = 1,
      companyId,
    } = filters;

    let query = Review.query().withGraphFetched('[account, trip.[busRoute.[route.[startLocation, endLocation]], template], bus_companies]');

    // Apply company filter if provided
    if (companyId) {
      query = query.where('reviews.company_id', companyId);
    }

    // Apply filters
    if (isVisible !== undefined) {
      query = query.where('reviews.is_visible', isVisible);
    }

    if (rating) {
      query = query.where('reviews.rating', rating);
    }

    if (search) {
      query = query.where('reviews.commenttext', 'ilike', `%${search}%`);
    }

    if (tripId) {
      query = query.where('reviews.trip_id', tripId);
    }

    if (userId) {
      query = query.where('reviews.create_by', userId);
    }

    // Count total records
    const countQuery = query.clone();
    const total = await countQuery.resultSize();

    // Apply pagination
    const offset = (pageNumber - 1) * pageSize;
    const reviews = await query
      .orderBy('reviews.create_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    return {
      reviews,
      totalReviews: total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize,
    };
  }

  /**
   * Get review by ID
   */
  async getReviewById(id: string, companyId?: string): Promise<Review> {
    let query = Review.query()
      .findById(id)
      .withGraphFetched('[account, trip.[busRoute.[route.[startLocation, endLocation]], template], bus_companies]') as any;

    const review = await query;

    if (!review) {
      throw new Error('Review not found');
    }

    // Verify company ownership if companyId provided
    if (companyId && review.companyId !== companyId) {
      throw new Error('Review does not belong to this company');
    }

    return review;
  }

  /**
   * Update review
   */
  async updateReview(
    id: string,
    data: Partial<{
      commenttext: string;
      rating: number;
      isVisible: boolean;
    }>,
    companyId?: string
  ): Promise<Review> {
    // Get and validate review
    const review = await this.getReviewById(id, companyId);

    const updatedReview = await Review.query()
      .patchAndFetchById(id, {
        ...(data.commenttext !== undefined && { commenttext: data.commenttext }),
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      });

    return updatedReview;
  }

  /**
   * Delete review
   */
  async deleteReview(id: string, companyId?: string): Promise<void> {
    // Get and validate review
    await this.getReviewById(id, companyId);

    await Review.query().deleteById(id);
  }

  /**
   * Toggle review visibility (admin only)
   */
  async toggleVisibility(id: string): Promise<Review> {
    const review = await this.getReviewById(id);

    const updatedReview = await Review.query()
      .patchAndFetchById(id, {
        isVisible: !review.isVisible,
      });

    return updatedReview;
  }
}

export default new ReviewService();
