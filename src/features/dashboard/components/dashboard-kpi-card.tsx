import { TrendingDownIcon, TrendingUpIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { KPI } from "~/types/component";

interface Props {
  kpi: KPI;
}
const DashboardKPICard = ({ kpi }: Props) => {
  const Icon = kpi.icon ?? XIcon;
  return (
    <Card className="py-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{kpi.label}</CardTitle>
        <div
          className="rounded-full p-2"
          style={{ backgroundColor: `${kpi.color ?? "#c2814d"}20` }}
        >
          <Icon
            className="text-muted-foreground h-4 w-4"
            color={kpi.color ?? "#c2814d"}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">{kpi.value}</div>
        {kpi.subtitle ? (
          <>
            <div className="flex flex-row items-center gap-2">
              <div
                className={cn(
                  "size-fit rounded-full p-1.5",
                  kpi.trending === "up" ? "bg-green-100" : "bg-rose-100",
                )}
              >
                {kpi.trending === "up" ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-rose-500" />
                )}
              </div>

              <p className="text-muted-foreground font-mono text-sm">
                {kpi.subtitle}
              </p>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DashboardKPICard;
