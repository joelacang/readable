import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const KPICardSkeleton = () => {
  return (
    <Card className="py-4">
      <CardContent>
        <div className="flex h-40 flex-col items-start justify-between">
          <div className="flex w-full flex-row items-center justify-between">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-12 w-24" />
            <div className="flex w-full items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICardSkeleton;
