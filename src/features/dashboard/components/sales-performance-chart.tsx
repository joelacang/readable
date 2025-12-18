import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { GroupedSalesUnits } from "~/types/order";

interface Props {
  data: GroupedSalesUnits[];
  title: string;
  onPreviousButtonClick: () => void;
  onNextButtonClick: () => void;
  isLoading?: boolean;
  cursor?: number;
}

const SalesPerformanceChart = ({
  data,
  title,
  onPreviousButtonClick,
  onNextButtonClick,
  isLoading = false,
  cursor = 0,
}: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{`Sales Performance: ${title}`}</CardTitle>
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            className="hover:text-primary text-primary rounded-full"
            variant="ghost"
            size="icon"
            onClick={onPreviousButtonClick}
            disabled={isLoading}
          >
            <ChevronLeftIcon className="!size-6" />
          </Button>
          <Button
            className="hover:text-primary text-primary rounded-full"
            variant="ghost"
            size="icon"
            onClick={onNextButtonClick}
            disabled={isLoading || cursor === 0}
          >
            <ChevronRightIcon className="!size-6" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="var(--chart-1)" />
            <Bar dataKey="units" fill="var(--chart-2)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesPerformanceChart;
