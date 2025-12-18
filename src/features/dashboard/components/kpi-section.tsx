"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DateRange } from "~/types/component";
import KPIGroup from "./kpi-group";
import SalesPerformanceSection from "./sales-performance-section";

const KPISection = () => {
  const [currentRange, setCurrentRange] = useState<DateRange>(
    DateRange.QUARTER,
  );

  return (
    <div className="w-full">
      <div className="flex w-full flex-row items-center justify-end pb-8">
        <Select
          value={currentRange}
          onValueChange={(value) => setCurrentRange(value as DateRange)}
        >
          <SelectTrigger className="w-56 cursor-pointer">
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent className="w-56">
            {Object.values(DateRange).map((range) => (
              <SelectItem className="cursor-pointer" key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-8">
        <KPIGroup range={currentRange} />
        <SalesPerformanceSection range={currentRange} />
      </div>
    </div>
  );
};

export default KPISection;
