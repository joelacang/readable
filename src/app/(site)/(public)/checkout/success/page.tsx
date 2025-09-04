// ~/app/checkout/success/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const CheckoutSuccess = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [timeoutReached, setTimeoutReached] = useState(false);
  const router = useRouter();

  // Query order using session ID with polling
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = api.order.getOrderBySessionId.useQuery(
    { sessionId: sessionId! },
    {
      enabled: !!sessionId && !timeoutReached,
      refetchInterval: (data) => {
        // Stop polling if order found or timeout reached
        return data || timeoutReached ? false : 2000;
      },
      retry: 3,
    },
  );

  //Set a timeout after 30 seconds
  useEffect(() => {
    if (sessionId) {
      const timeout = setTimeout(() => {
        setTimeoutReached(true);
      }, 30000); // 30 seconds max wait

      return () => clearTimeout(timeout);
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Session</h1>
        <p>No session ID found. Please try again.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>{error.message}</p>
        <Button
          onClick={() => refetch()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <h1 className="text-2xl font-bold">Processing Your Order...</h1>
        <p className="text-gray-600">This usually takes a few seconds.</p>
        {timeoutReached && (
          <div className="mt-4 rounded bg-yellow-100 p-4">
            <p>
              Taking longer than expected. Your order may still be processing.
            </p>
            <Button
              onClick={async () => {
                setTimeoutReached(false);
                await refetch();
              }}
              className="mt-2 rounded bg-yellow-500 px-4 py-2 text-white"
            >
              Check Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600">Order Completed!</h1>
        <p className="mt-2 text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="rounded-lg bg-gray-50 px-8 py-6">
        <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Order Reference:&nbsp;</strong>
            <span className="font-semibold text-green-600">
              {order.refCode.toUpperCase()}
            </span>
          </p>
          <p>
            <strong>Amount:</strong> ${order.totalAmount}
          </p>
          <p>
            <strong>Date Processed:</strong>{" "}
            {new Date(order.dateCreated).toLocaleString()}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => router.push(`/orders?ref=${order.refCode}`)}>
          View Order Details
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
