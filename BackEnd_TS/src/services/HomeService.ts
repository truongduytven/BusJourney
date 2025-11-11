import Route from '../models/Route';
import Trip from '../models/Trip';
import { raw } from 'objection';

class HomeService {
  /**
   * Get featured routes (popular routes with most bookings)
   */
  async getFeaturedRoutes(limit: number = 6) {
    try {
      // Get routes with most trips and bookings
      const featuredRoutes = await Route.query()
        .withGraphFetched('[startLocation.city, endLocation.city, trips(active)]')
        .modifiers({
          active: (builder) => {
            builder
              .where('departure_time', '>=', new Date().toISOString())
              .orderBy('departure_time', 'asc')
              .limit(1);
          },
        })
        .select(
          'routes.*',
          raw(`(
            SELECT COUNT(*)
            FROM trips
            WHERE trips.bus_routes_id IN (SELECT id FROM bus_routes WHERE route_id = routes.id)
            AND trips.departure_time >= NOW()
          ) as upcoming_trips_count`)
        )
        .orderBy('upcoming_trips_count', 'desc')
        .limit(limit);

      const formattedRoutes = featuredRoutes.map((route: any) => {
        const trip = route.trip?.[0];
        return {
          id: route.id,
          from: {
            location: route.startLocation?.name || '',
            city: route.startLocation?.city?.name || '',
          },
          to: {
            location: route.endLocation?.name || '',
            city: route.endLocation?.city?.name || '',
          },
          distance: route.distance,
          upcomingTripsCount: parseInt(route.upcoming_trips_count) || 0,
          nextTrip: trip
            ? {
                id: trip.id,
                departureTime: trip.departureTime,
                price: trip.price,
                availableSeats: trip.availableSeats,
              }
            : null,
        };
      });

      return {
        success: true,
        data: formattedRoutes,
      };
    } catch (error) {
      console.error('Get featured routes error:', error);
      throw error;
    }
  }

  /**
   * Get active coupons for homepage
   */
  async getActiveCoupons(limit: number = 6) {
    try {
      const now = new Date();
      const activeCoupons = await require('../models/Coupon')
        .default.query()
        .where('valid_from', '<=', now.toISOString())
        .where('valid_to', '>=', now.toISOString())
        .where('status', 'active')
        .where('used_count', '>', 0)
        .orderBy('discount_value', 'desc')
        .limit(limit)
        .select(
          'id',
          'description',
          'discount_type',
          'discount_value',
          'max_discount_value',
          'used_count',
          'valid_from',
          'valid_to'
        );

      return {
        success: true,
        data: activeCoupons,
      };
    } catch (error) {
      console.error('Get active coupons error:', error);
      throw error;
    }
  }

  /**
   * Get featured reviews (high ratings with comments)
   */
  async getFeaturedReviews(limit: number = 10) {
    try {
      const featuredReviews = await require('../models/Reviews')
        .default.query()
        .withGraphFetched('[account, trip.[route.[startLocation.city, endLocation.city]]]')
        .where('is_visible', true)
        .where('rating', '>=', 4)
        .whereNotNull('commenttext')
        .where('commenttext', '!=', '')
        .orderBy('rating', 'desc')
        .orderBy('create_at', 'desc')
        .limit(limit)
        .select(
          'reviews.id',
          'reviews.rating',
          'reviews.commenttext',
          'reviews.create_at'
        );

      const formattedReviews = featuredReviews.map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.commenttext,
        createdAt: review.createAt,
        user: {
          name: review.account?.name || 'Khách hàng',
          avatar: review.account?.avatar || '',
        },
        trip: review.trip
          ? {
              from: {
                location: review.trip.route?.startLocation?.name || '',
                city: review.trip.route?.startLocation?.city?.name || '',
              },
              to: {
                location: review.trip.route?.endLocation?.name || '',
                city: review.trip.route?.endLocation?.city?.name || '',
              },
            }
          : null,
      }));

      return {
        success: true,
        data: formattedReviews,
      };
    } catch (error) {
      console.error('Get featured reviews error:', error);
      throw error;
    }
  }
}

export default new HomeService();
