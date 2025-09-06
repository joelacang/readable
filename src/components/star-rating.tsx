import { useState } from "react";
import { Star } from "lucide-react"; // or use Heroicons / FontAwesome
import { cn } from "~/lib/utils";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  compact?: boolean;
};

export const StarRating = ({
  value,
  onChange,
  max = 5,
  disabled = false,
  compact = false,
}: StarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => {
        const rating = i + 1;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => {
              if (onChange) {
                onChange(rating);
              }
            }}
            onMouseEnter={() => setHover(rating)}
            onMouseLeave={() => setHover(null)}
            className={cn(
              "group",
              disabled ? "pointer-events-none" : "pointer-events-auto",
            )}
          >
            <Star
              size={compact ? 16 : 24}
              fill={(hover ?? value) >= rating ? "#facc15" : "none"} // yellow-400
              stroke={(hover ?? value) >= rating ? "#facc15" : "#d1d5db"} // gray-300
              className="transition-colors"
            />
          </button>
        );
      })}
    </div>
  );
};
