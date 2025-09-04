import { HeartIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useWishlistSheet } from "~/features/wishlist/hooks/use-wishlist-sheet";
import { api } from "~/trpc/react";
import { formatNumber } from "~/utils/get-values";

interface Props {
  enabled?: boolean;
}
const WishlistButton = ({ enabled = false }: Props) => {
  const { data: count } = api.wishlist.getCount.useQuery(undefined, {
    enabled,
  });
  const { onOpen } = useWishlistSheet();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative cursor-pointer rounded-full"
        onClick={onOpen}
      >
        <HeartIcon className="!size-6" />
      </Button>
      {count && count > 0 ? (
        <div className="absolute -top-1 -right-1">
          <div className="bg-destructive flex items-center justify-center rounded-full px-2">
            <span className="text-[10px] font-medium text-white">
              {formatNumber(count)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WishlistButton;
