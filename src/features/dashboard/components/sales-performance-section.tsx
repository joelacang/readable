import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import type { DateRange } from "~/types/component";
import SalesPerformanceChart from "./sales-performance-chart";
import { useState } from "react";

interface Props {
  range: DateRange;
}

const SalesPerformanceSection = ({ range }: Props) => {
  const [cursor, setCursor] = useState(0);
  const {
    data: results,
    isLoading,
    isError,
    error,
  } = api.dashboard.getSalesPerformance.useQuery({ range, cursor: 0 });

  return (
    <QueryStateHandler
      data={results}
      isLoading={isLoading}
      isError={isError}
      loadingLabel="Loading Sales Performance..."
      errorTitle="Error Fetching Sales Performance"
      errorMessage={error?.message ?? "An unknown error occurred."}
      emptyTitle="No Data Found"
      emptyDescription={`No Data Found for range: ${range}`}
    >
      {(results) => (
        <>
          <SalesPerformanceChart
            data={results.data}
            title={results.title}
            onPreviousButtonClick={() => setCursor((prev) => prev - 1)}
            onNextButtonClick={() => setCursor((prev) => prev + 1)}
            cursor={cursor}
          />
          {cursor}
        </>
      )}
    </QueryStateHandler>
  );
};

export default SalesPerformanceSection;
