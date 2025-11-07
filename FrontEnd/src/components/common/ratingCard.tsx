import { Star } from "lucide-react";
import type { FeaturedReview } from "@/types/home";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RatingCardProps {
  review: FeaturedReview;
}

export default function RatingCard({ review }: RatingCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden p-6 gap-2 bg-white hover:shadow-xl transition-shadow duration-300">
      {review.trip && (
        <b className="text-primary">
          {review.trip.from.city} - {review.trip.to.city}
        </b>
      )}
      <p className="text-sm text-gray-600 mb-4 line-clamp-4">
        {review.comment}
      </p>
      <div className="w-full h-[1px] bg-gray-200" />
      <div className="flex items-center">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.user.avatar} alt={review.user.name} />
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm">
            {getInitials(review.user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 text-start">
          <p className="font-semibold">{review.user.name}</p>
          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
        <div className="flex items-center ml-auto text-sm text-gray-500 gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              fill={star <= review.rating ? "gold" : "white"} 
              className="h-3 w-3 text-yellow-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
