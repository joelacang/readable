import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  format,
  getQuarter,
} from "date-fns";
import { DateRange } from "~/types/component";
import type { GroupedSalesUnits } from "~/types/order";
import { getDateRange } from "~/utils/get-values";
import { db } from "../db";
import { Prisma } from "@prisma/client";

type RangeConfig = {
  dateTruncField: string;
  labelFormat: string;
  advancedFn: (date: Date) => Date;
  titleFn: (start: Date, end: Date) => string;
};

export const rangeConfig: Record<DateRange, RangeConfig> = {
  [DateRange.DAY]: {
    dateTruncField: "hour",
    labelFormat: "ha",
    advancedFn: (date) => addHours(date, 1),
    titleFn: (start) => format(start, "MMM d, yyyy"), // e.g., Sep 16, 2025
  },
  [DateRange.WEEK]: {
    dateTruncField: "day",
    labelFormat: "eeee",
    advancedFn: (date) => addDays(date, 1),
    titleFn: (start, end) =>
      `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`, // Sep 9 - Sep 15, 2025
  },
  [DateRange.MONTH]: {
    dateTruncField: "week",
    labelFormat: "'Week' II",
    advancedFn: (date) => addWeeks(date, 1),
    titleFn: (start) => format(start, "MMMM, yyyy"), // September, 2025
  },
  [DateRange.QUARTER]: {
    dateTruncField: "month",
    labelFormat: "MMM",
    advancedFn: (date) => addMonths(date, 1),
    titleFn: (start) => `Q${getQuarter(start)}, ${format(start, "yyyy")}`, // Q3, 2025
  },
  [DateRange.ANNUAL]: {
    dateTruncField: "month",
    labelFormat: "MMM",
    advancedFn: (date) => addMonths(date, 1),
    titleFn: (start) => format(start, "yyyy"), // 2025
  },
} as const;

export async function getSalesPerformanceGroupedBy(
  range: DateRange,
): Promise<{ data: GroupedSalesUnits[]; title: string }> {
  const { start, end } = getDateRange({ range, mode: "recent" });
  const config = rangeConfig[range];

  const statuses = ["PENDING", "PAID", "IN_TRANSIT", "DELIVERED"];

  const rawStatuses = Prisma.join(
    statuses.map((s) => Prisma.raw(`'${s}'::"OrderStatus"`)),
  );

  const rows: GroupedSalesUnits[] = await db.$queryRaw`
  SELECT
      date_trunc(${Prisma.raw(`'${config.dateTruncField}'`)}, "OrderItem"."createdAt") as period,
      COALESCE(SUM("OrderItem"."subTotal")::FLOAT, 0) AS revenue,
      COALESCE(SUM("OrderItem"."quantity")::INT, 0) AS units
    FROM "OrderItem"
    JOIN "Order" ON "Order"."id" = "OrderItem"."orderId"
    WHERE "Order"."status" IN (${rawStatuses})
      AND "OrderItem"."createdAt" >= ${start}
      AND "OrderItem"."createdAt" < ${end}
    GROUP BY period
    ORDER BY period;
  `;

  const map = new Map<string, GroupedSalesUnits>();

  rows.forEach((r) => {
    const dt: Date = new Date(r.period);
    const label = format(dt, config.labelFormat);
    map.set(label, {
      period: label,
      revenue: parseFloat(r.revenue?.toString() ?? "0"),
      units: parseInt(r.units?.toString() ?? "0"),
    });
  });

  // Fill missing buckets with 0
  const buckets: GroupedSalesUnits[] = [];
  let cursor = start;

  while (cursor && end && cursor < end) {
    const label = format(cursor, config.labelFormat);
    const data = map.get(label) ?? {
      period: label,
      revenue: 0,
      units: 0,
    };
    buckets.push(data);
    cursor = config.advancedFn(cursor);
  }

  return {
    data: buckets,
    title: start && end ? config.titleFn(start, end) : "Unknown",
  };
}
