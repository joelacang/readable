import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { BookDetail } from "~/types/book";
import type { OrderPreviewType } from "~/types/order";
import { getStatusStyles } from "~/utils/get-values";

interface Props {
  order: OrderPreviewType;
  book?: BookDetail;
  isAdmin?: boolean;
}
const OrderPreviewCard = ({ order, book, isAdmin }: Props) => {
  const router = useRouter();

  return (
    <Card
      className="shadow-primary w-full cursor-pointer transition-shadow duration-200 hover:shadow-md"
      onClick={() => {
        if (isAdmin) {
          if (book) {
            router.push(`/admin/books/${book.slug}/orders/${order.refCode}`);
          }
        } else {
          router.push(`/user/orders/${order.refCode}`);
        }
      }}
    >
      <CardContent className="">
        <div className="flex flex-col items-start justify-between gap-4">
          {/* Left Section - User Info */}
          <div className="flex flex-col gap-2">
            <div className="px2 w-fit rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-900">
                  Ref Code:
                </span>
                <span className="font-mono text-sm font-bold tracking-wide text-blue-800">
                  {order.refCode.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-start gap-4">
              <Avatar className="size-14 ring-2 ring-gray-100">
                <AvatarImage
                  src={
                    order.userInfo?.image ?? "/images/avatar-placeholder.jpg"
                  }
                  alt={order.userInfo?.name ?? "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
                  {order.userInfo?.name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-primary truncate font-semibold">
                    {order.userInfo?.name ?? "Guest User"}
                  </h3>
                </div>

                <p className="truncate text-sm text-gray-600">
                  @{order.userInfo?.username ?? "guest"}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={cn(
                      `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium`,
                      getStatusStyles(order.status),
                    )}
                  >
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                    {order.status}
                  </div>
                  <span className="text-xs text-gray-500">
                    {order.dateCreated.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Amount */}
          <div className="flex w-full items-center justify-end gap-4">
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${order.totalAmount.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-gray-500">Total Amount</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPreviewCard;
