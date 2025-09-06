import type { TRPCClientError } from "@trpc/client";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons/lib";
import z from "zod";
import type { AppRouter } from "~/server/api/root";

export type MenuItemType = {
  name: string;
  label: string;
  action?: () => void;
  icon?: LucideIcon | IconType;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  hasSeparator?: boolean;
  hasUpperSeparator?: boolean;
  childMenus?: MenuItemType[];
  isDestructive?: boolean;
  subMenus?: MenuItemType[];
  color?: string;
};

export enum ConfirmationType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  DEFAULT = "default",
}
export enum Size {
  XSMALL,
  SMALL,
  MEDiUM,
  LARGE,
  XLARGE,
}

export enum AgeRating {
  G = "G",
  PG = "PG",
  PG13 = "PG-13",
  R = "R",
  ADULT = "Adult",
}

export type Option = {
  value: string;
  label: string;
  mode: "create" | "update";
};

export const formIdentitySchema = z.object({
  id: z.string().cuid(),
  mode: z.enum(["create", "update"]),
  name: z.string(),
});

export type FormIdentityType = z.infer<typeof formIdentitySchema>;

export type LinkDetailType = {
  id: string;
  name: string;
  slug: string;
};

export type QueryStateHandlerProps<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined | null;
  loadingLabel?: string | React.ReactNode | null;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorMessage?: string | null;
  children: (data: T) => React.ReactNode;
};
