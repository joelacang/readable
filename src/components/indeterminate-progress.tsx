import { cn } from "~/lib/utils";
import { Progress } from "./ui/progress";

const IndeterminateProgress = () => {
  return (
    <div className={cn("bg-muted relative h-1 w-full overflow-hidden rounded")}>
      <Progress className="absolute h-full w-full bg-transparent" value={0} />
      <div className="bg-primary animate-indeterminate absolute h-full w-1/3 rounded" />
    </div>
  );
};

export default IndeterminateProgress;
