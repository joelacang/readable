"use client";
import { MenuIcon } from "lucide-react";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import BrowseCategoryDropdownMenu from "~/features/categories/components/category-browse-dropdown-menu";
import UserDropdownMenu from "~/features/users/components/user-dropdown-menu";
import { useIsMobile } from "~/hooks/use-mobile";
import CartButton from "./cart-button";
import WishlistButton from "./wishlist-button";
import { useLoggedUser } from "~/features/users/hooks/use-logged-user";
import { useRouter } from "next/navigation";
import BookSearchBar from "~/features/books/components/book-search-bar";

const NavbarContent = () => {
  const isMobile = useIsMobile();
  const { loggedUser } = useLoggedUser();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <div className="cursor-pointer" onClick={() => router.push(`/`)}>
          <Logo showLabel={!isMobile} className="cursor-pointer" />
        </div>
      </div>

      <div className="hidden w-full max-w-3xl items-center justify-center gap-2 xl:flex">
        <BrowseCategoryDropdownMenu />
        {/* Search Bar */}
        <div className="flex-1 items-center justify-center">
          <BookSearchBar />
        </div>
      </div>
      {/* Categories Dropdown */}

      {/* Navigation Items */}
      <div className="flex items-center space-x-4">
        {/* Wishlist */}

        <WishlistButton enabled={!!loggedUser} />
        <CartButton enabled={!!loggedUser} />

        {/* User Menu */}
        <UserDropdownMenu />
      </div>
    </div>
  );
};

export default NavbarContent;
