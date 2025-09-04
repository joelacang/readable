"use client";

import { useEffect, useState } from "react";
import CartSheet from "~/features/cart/components/cart-sheet";
import CategorySheet from "~/features/categories/components/category-sheet";
import WishlistSheet from "~/features/wishlist/components/wishlist-sheet";

const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CategorySheet />
      <CartSheet />
      <WishlistSheet />
    </>
  );
};

export default SheetProvider;
