import { Skeleton } from "~/components/ui/skeleton";
import { useIsMobile } from "~/hooks/use-mobile";

const BookListItemSkeleton = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    <div>
      <p>Mobile Version Goes Here</p>
    </div>;
  }
  return (
    <div className="flex flex-row items-start justify-start gap-4 p-2 lg:gap-8 lg:p-4">
      <div className="px-4 sm:px-6">
        <Skeleton className="aspect-[1/1.5] w-12 sm:w-20" />
      </div>
      <div className="flex-1 space-y-1">
        <Skeleton className="h-5 w-48 sm:h-7" />
        <Skeleton className="h-3 w-32 sm:h-5" />
        <div className="hidden pt-2 md:flex">
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
        <div className="hidden space-y-1 py-2 sm:block">
          <Skeleton className="h-4 w-full lg:w-3/4" />
          <Skeleton className="h-4 w-full lg:w-3/4" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 sm:h-6" />
          <Skeleton className="h-3 w-16 sm:h-5" />
        </div>
      </div>
    </div>
  );
};

export default BookListItemSkeleton;
