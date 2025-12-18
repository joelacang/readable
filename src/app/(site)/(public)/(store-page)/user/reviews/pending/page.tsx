"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Hint from "~/components/hint";
import { QueryStateHandler } from "~/components/query-state-handler";
import { buttonVariants } from "~/components/ui/button";
import OrderItem from "~/features/orders/order-item";
import PageHeader from "~/features/page/components/page-header";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const MyPendingReviewsPage = () => {
  const {
    data: items,
    isLoading,
    isError,
  } = api.review.getPendingReviews.useQuery();
  return (
    <div>
      <PageHeader
        title="My Pending Reviews"
        description="All your pending reviews here."
      />
      <QueryStateHandler
        data={items}
        isLoading={isLoading}
        isError={isError}
        loadingLabel="Loading Pending Reviews..."
      >
        {(items) => (
          <div>
            {Object.entries(items).map(([refCode, orderItems]) => {
              return (
                <div key={refCode} className="pb-4">
                  <div className="flex flex-row items-center justify-between gap-2 py-2 font-mono text-sm">
                    <p className="text-muted-foreground font-medium">
                      Order Ref. Code:&nbsp;
                      <span className={cn("font-semibold text-blue-500")}>
                        {refCode}
                      </span>
                    </p>

                    <Hint label="View Order Detail">
                      <Link
                        className={cn(buttonVariants({ variant: "link" }))}
                        href={`/user/orders?ref=${refCode}`}
                      >
                        View Order <ArrowRight />
                      </Link>
                    </Hint>
                  </div>

                  <div className="space-y-2">
                    {orderItems.map((orderItem) => (
                      <OrderItem
                        key={orderItem.id}
                        item={orderItem}
                        showReviewButton
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default MyPendingReviewsPage;
