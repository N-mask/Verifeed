import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number | null;
  interactive?: boolean;
  onRate?: (score: number) => void;
  size?: number;
}

const StarRating = ({ rating, interactive = false, onRate, size = 18 }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  const display = hover || rating || 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`transition-colors ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= display
                ? "fill-accent text-accent"
                : "fill-none text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
      {rating !== null && (
        <span className="ml-1.5 text-xs font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
