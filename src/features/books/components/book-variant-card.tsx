import { Badge } from "~/components/ui/badge";
import type { BookVariant } from "~/types/book";

interface Props {
  variant: BookVariant;
}

const BookVariantCard = ({ variant }: Props) => {
  return (
    <div className="bg-card col-span-1 rounded-lg border p-4 shadow-sm">
      <div className="mb-2 flex flex-col items-start justify-start">
        <h3 className="text-base font-semibold">
          {variant.title ?? "Untitled Variant"}
        </h3>
        <Badge>{variant.format}</Badge>
      </div>

      <div className="flex items-baseline font-semibold">
        <span className="text-base">$</span>
        <span className="text-muted-foreground text-xl">
          {variant.price.toFixed(2)}
        </span>
      </div>

      {variant.stock != null && (
        <div className="mt-2 text-sm">
          Stock:{" "}
          <span
            className={`font-medium ${
              variant.stock > 0 ? "text-foreground" : "text-destructive"
            }`}
          >
            {variant.stock > 0 ? variant.stock : "Out of stock"}
          </span>
        </div>
      )}
    </div>
  );
};

export default BookVariantCard;
