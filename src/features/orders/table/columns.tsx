"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { STATUS_CODES } from "node:http";
import TableCell from "~/components/table/table-cell";
import TableHeader from "~/components/table/table-header";
import { buttonVariants } from "~/components/ui/button";
import UserAvatar from "~/features/users/components/user-avatar";
import { cn } from "~/lib/utils";
import type { OrderPreviewType } from "~/types/order";
import { getStatusStyles } from "~/utils/get-values";

export const orderColumns: ColumnDef<OrderPreviewType>[] = [
  {
    accessorKey: "refCode",
    header: () => <TableHeader>Reference Code</TableHeader>,
    cell: ({ row }) => {
      return (
        <TableCell isCentered>
          <Link
            href={`/orders?ref=${row.original.refCode}`}
            className={cn(
              "text-primary font-semibold",
              buttonVariants({ variant: "link" }),
            )}
          >
            {row.original.refCode.toUpperCase()}
          </Link>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "userInfo.name",
    header: () => <TableHeader>Customer Name</TableHeader>,
    cell: ({ row }) => {
      const user = row.original.userInfo;
      return (
        <TableCell
          className="line-clamp-1 break-words whitespace-normal"
          isCentered
        >
          {user ? (
            <div className="flex flex-row items-center justify-center gap-3">
              <UserAvatar user={user} />
              <div className="hidden md:block">
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                No User
              </span>
            </div>
          )}
        </TableCell>
      );
    },
  },
  {
    accessorKey: "dateCreated",
    header: () => <TableHeader>Date Processed</TableHeader>,
    cell: ({ row }) => (
      <TableCell isCentered>
        <p className="text-sm font-medium text-gray-900">
          {row.original.dateCreated.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </TableCell>
    ),
  },
  {
    accessorKey: "status",
    header: () => <TableHeader>Status</TableHeader>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <TableCell isCentered>
          <span
            className={cn(
              `inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold`,
              getStatusStyles(status),
            )}
          >
            {status}
          </span>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <TableHeader>Total Amount</TableHeader>,
    cell: ({ row }) => {
      const amount = row.original.totalAmount;
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(amount);

      return (
        <TableCell isCentered>
          <div className="flex flex-col items-center">
            <p className="text-base font-semibold">{formattedAmount}</p>
          </div>
        </TableCell>
      );
    },
  },
];
