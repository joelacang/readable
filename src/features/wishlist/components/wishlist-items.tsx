import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import Loading from "~/components/loading";
import MessageBox from "~/components/message-box";
import { api } from "~/trpc/react";
import { ConfirmationType } from "~/types/component";
import WishlistItem from "./wishlist-item";

const WishListItems = () => {
  const {
    data: wishlist,
    isLoading,
    isError,
    error,
  } = api.wishlist.getWishlistItems.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading label="Loading Wishlist items..." />
      </div>
    );
  }

  if (isError) {
    return (
      <MessageBox
        title="Error Loading Cart."
        description={error.message}
        icon={TriangleAlertIcon}
        mode={ConfirmationType.ERROR}
        isCompact
      />
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="p-4">
        <MessageBox
          title="No Wishlist found."
          description="Sorry, no wishlist is found in your account."
          icon={SearchXIcon}
          mode={ConfirmationType.DEFAULT}
          isCompact
        />
      </div>
    );
  }
  return (
    <div className="">
      <div className="px-4 pb-4">
        <p className="text-sm font-medium">
          There are&nbsp;
          <span className="text-primary font-semibold">
            {wishlist.length}
          </span>{" "}
          items on your wishlist.
        </p>
      </div>

      {wishlist.map((item) => (
        <WishlistItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default WishListItems;
