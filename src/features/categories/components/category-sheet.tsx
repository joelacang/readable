import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import CategoryMenus from "./category-menus";
import { useCategorySheet } from "../hooks/use-category-sheet";
import { useIsMobile } from "~/hooks/use-mobile";
import { useEffect } from "react";

const CategorySheet = () => {
  const { open, onClose } = useCategorySheet();
  const isMobile = useIsMobile();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 80rem)"); // 1280px

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches && open) {
        onClose(); // Close the sheet when screen is wider than 1280px
      }
    };

    // Initial check
    if (mediaQuery.matches && open) {
      onClose();
    }

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [open, onClose]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="h-full overflow-y-auto">
        <SheetHeader className="hidden">
          <SheetTitle>Categories</SheetTitle>
          <SheetDescription>All Book Categories</SheetDescription>
        </SheetHeader>
        <div className="pb-4">
          <CategoryMenus />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;
