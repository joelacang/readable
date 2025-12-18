// ~/app/checkout/success/page.tsx
"use client";

import { Suspense } from "react";

const CheckoutSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <p>Loading...</p>
        </div>
      }
    >
      <CheckoutSuccessPage />
    </Suspense>
  );
};

export default CheckoutSuccessPage;
