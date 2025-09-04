import { BookFormat } from "@prisma/client";
import {
  BookIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  SmartphoneIcon,
  type LucideIcon,
} from "lucide-react";
import { Label } from "~/components/ui/label";
import { RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";
import type { BookVariantType } from "~/types/book";

interface Props {
  variant: BookVariantType;
  isSelected?: boolean;
}

const getIcon = (format: BookFormat): LucideIcon => {
  switch (format) {
    case BookFormat.Hardcover:
      return BookIcon;
    case BookFormat.Paperback:
      return BookOpenIcon;
    case BookFormat.Digital:
      return SmartphoneIcon;
    default:
      return BookIcon;
  }
};

const BookVariantSelect = ({ variant, isSelected = false }: Props) => {
  const Icon = getIcon(variant.format);
  const outOfStock =
    variant.format !== BookFormat.Digital &&
    (!variant.stock || variant.stock === 0);

  return (
    <div key={variant.id} className="relative">
      <div className="space-y-1">
        <Label
          htmlFor={variant.id}
          className={cn(
            `relative flex w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-1 p-4 transition-all duration-200 hover:bg-transparent`,
            isSelected
              ? "border-primary bg-muted/50 shadow-lg shadow-blue-500/25"
              : "hover:border-muted hover:bg-muted/50 border-muted bg-transparent",
            outOfStock && "pointer-events-none bg-gray-100 hover:bg-gray-100",
          )}
        >
          <RadioGroupItem
            value={variant.id}
            id={variant.id}
            className="sr-only"
            // Hide the actual radio button
          />

          <Icon
            className={cn(
              outOfStock
                ? "text-muted-foreground"
                : isSelected
                  ? "text-primary"
                  : "text-gray-900",
              `h-6 w-6`,
            )}
          />

          <div className="pt-2 text-center">
            <p
              className={cn(
                outOfStock
                  ? "text-muted-foreground"
                  : isSelected
                    ? "text-primary"
                    : "text-gray-900",
                `text-xs leading-none font-medium`,
              )}
            >
              {variant.format}
            </p>
            <p
              className={cn(
                outOfStock
                  ? "text-muted-foreground"
                  : isSelected
                    ? "text-primary"
                    : "text-gray-900",
                `text-sm font-bold`,
              )}
            >
              ${variant.price}
            </p>
          </div>
        </Label>
        {outOfStock && (
          <div className="bg-destructive w-fit">
            <p className="px-3 py-1 text-center text-xs font-semibold text-white">
              Out of Stock
            </p>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2Icon
            className="!size-5"
            fill="#b48165"
            color="#f6eee2"
          />
        </div>
      )}
    </div>
  );
};

export default BookVariantSelect;
