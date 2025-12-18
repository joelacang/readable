import { BookIcon, type LucideIcon } from "lucide-react";
import {
  DateRange,
  ModeType,
  Size,
  type FormIdentityType,
  type MenuItemType,
  type Option,
} from "~/types/component";
import { BookFormat, type OrderStatus } from "@prisma/client";
import type { CategoryDetailType } from "~/types/categories";
import * as Icons from "lucide-react";
import type { AddressType } from "~/types/order";
import { AdminView } from "~/types/book";
import {
  addressDefaultValues,
  type addressSchema,
} from "~/zod-schemas/contact";
import type z from "zod";
import {
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subQuarters,
  subWeeks,
  subYears,
} from "date-fns";

export function getSize(size: Size): number {
  switch (size) {
    case Size.XSMALL:
      return 16;
    case Size.SMALL:
      return 24;
    case Size.MEDiUM:
      return 32;
    case Size.LARGE:
      return 56;
    case Size.XLARGE:
      return 80;
    default:
      return 32;
  }
}

export function generateId(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateSlug(text: string): string {
  const cleanedText = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^a-z0-9\-]/g, "") // remove non-alphanumeric except hyphens
    .replace(/\-+/g, "-"); // collapse multiple hyphens

  const uniqueId = generateId(6); // you can customize the length
  return `${cleanedText}-${uniqueId.toLowerCase()}`;
}

export function getLucideIconByName(name: string): LucideIcon | null {
  const Icon = Icons[name as keyof typeof Icons] as LucideIcon | undefined;
  return Icon ?? null;
}

export function getNameInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function toSelectOptions<
  T extends { id: string; name: string; mode: "create" | "update" },
>(items: T[]): Option[] {
  return items.map((item) => ({
    value: item.id,
    label: item.name,
    mode: item.mode,
  }));
}

export function toSelectOption(data: FormIdentityType): Option {
  return {
    value: data.id,
    label: data.name,
    mode: data.mode,
  };
}

export function fromSelectOption(data: Option): FormIdentityType {
  return {
    id: data.value,
    name: data.label,
    mode: data.mode,
  };
}

export function fromSelectOptions(options: Option[]): FormIdentityType[] {
  return options.map((option) => ({
    id: option.value,
    name: option.label,
    mode: option.mode,
  }));
}

export function sanitizeInput(input: string) {
  return input
    .replace(/\s+/g, "-") // Convert spaces to dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove special symbols
    .toLowerCase(); // Optional: lowercase everything
}

export function fileArrayToFileList(files: File[]): FileList {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
}

export function formatVariantTitle(
  baseTitle: string,
  format: BookFormat,
): string {
  const knownFormats = Object.values(BookFormat).join("|");
  const formatSuffixRegex = new RegExp(`^(.*?)(\\s-\\s(${knownFormats}))?$`);

  const match = baseTitle.match(formatSuffixRegex);
  const title = match ? match[1]?.trim() : baseTitle;

  return `${title} - ${format}`;
}

export const convertCategoriesToMenuItems = (
  categories: CategoryDetailType[],
  router: { push: (url: string) => void },
): MenuItemType[] => {
  return categories.map((category) => ({
    name: category.slug,
    label: category.name,
    color: category.color ?? "#c2814d",
    action: () => {
      router.push(`/categories/${category.slug}/`);
    },
    icon: getLucideIconByName(category.icon ?? "Book") ?? BookIcon,
    disabled: false,
    hidden: false,
    hasSeparator: false,
    hasUpperSeparator: false,
    isDestructive: false,
    // Recursively convert subcategories to subMenus
    subMenus:
      category.subCategories && category.subCategories.length > 0
        ? convertCategoriesToMenuItems(category.subCategories, router)
        : [],
  }));
};

export function formatNumber(value: number): string {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });

  return formatter.format(value);
}

export function truncateText(
  text: string,
  maxLength: number,
  hideEllipsis?: boolean,
) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + `${!hideEllipsis ? "..." : ""}`;
  }
  return text;
}

export const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

export const formatAddress = (address: AddressType) => {
  const cityState = [address.city, address.state].filter(Boolean).join(", ");

  const firstLine = address.line1 + (address.line2 ? ` ${address.line2}` : "");
  const lastLine = [cityState, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");

  return [firstLine, lastLine].join(", ");
};

export const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CANCELED":
    case "FAILED":
    case "REFUNDED":
      return "bg-red-100 text-red-800 border-red-200";
    case "IN_TRANSIT":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

type AdminViewDetailsType = {
  name: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export const AdminViewDetails: Record<AdminView, AdminViewDetailsType> = {
  [AdminView.OVERVIEW]: {
    name: "overview",
    label: "Overview",
    icon: Icons.TableOfContentsIcon,
    description:
      "Get a high-level summary of the book's performance, visibility, and status in the store.",
  },
  [AdminView.DETAILS]: {
    name: "details",
    label: "Book Details",
    icon: Icons.BookIcon,
    description:
      "View and manage key information about the book, including title, author, description, and metadata.",
  },
  [AdminView.ANALYTICS]: {
    name: "analytics",
    label: "Analytics",
    icon: Icons.TrendingUpIcon,
    description:
      "Track metrics like views, sales, and engagement to understand how the book is performing over time.",
  },
  [AdminView.ORDERS]: {
    name: "orders",
    label: "Orders",
    icon: Icons.FileTextIcon,
    description: "View and manage orders for this book.",
  },
  [AdminView.INVENTORY]: {
    name: "inventory",
    label: "Inventory",
    icon: Icons.PackageIcon,
    description:
      "Manage stock levels, availability, and fulfillment settings for this book.",
  },
  [AdminView.REVIEWS]: {
    name: "reviews",
    label: "Reviews",
    icon: Icons.MessageSquareIcon,
    description:
      "Read and moderate customer reviews, and gain insights from reader feedback.",
  },
  [AdminView.PRICING]: {
    name: "pricing",
    label: "Pricing",
    icon: Icons.DollarSignIcon,
    description:
      "Adjust pricing, discounts, and promotional settings to optimize sales.",
  },
  [AdminView.SETTINGS]: {
    name: "settings",
    label: "Book Settings",
    icon: Icons.SettingsIcon,
    description: "Configure key details and metadata for your book",
  },
};

export function getModeTextColor(mode: ModeType): string {
  switch (mode) {
    case ModeType.DEFAULT:
      return "text-primary";
    case ModeType.ERROR:
      return "text-destructive";
    case ModeType.SUCCESS:
      return "text-green-500";
    case ModeType.INFO:
      return "text-blue-500";
    default:
      return "text-primary";
  }
}

type ModeDetailsType = {
  icon: LucideIcon;
  color: string;
  lightColor: string;
};
export const ModeDetails: Record<ModeType, ModeDetailsType> = {
  [ModeType.SUCCESS]: {
    icon: Icons.CheckCircle2Icon,
    color: "#22c55e",
    lightColor: "#dcfce7",
  },
  [ModeType.ERROR]: {
    icon: Icons.XCircleIcon,
    color: "#ef4444",
    lightColor: "#fee2e2",
  },
  [ModeType.INFO]: {
    icon: Icons.InfoIcon,
    color: "#3b82f6",
    lightColor: "#dbeafe",
  },
  [ModeType.DEFAULT]: {
    icon: Icons.InfoIcon,
    color: "#737373",
    lightColor: "#f5f5f5",
  },
  [ModeType.WARNING]: {
    icon: Icons.AlertCircleIcon,
    color: "#f59e0b",
    lightColor: "#fef3c7",
  },
};

export const isEmptyAddress = (address: z.infer<typeof addressSchema>) => {
  return (
    address &&
    address.line1 === addressDefaultValues.line1 &&
    address.city === addressDefaultValues.city &&
    address.postalCode === addressDefaultValues.postalCode &&
    address.country === addressDefaultValues.country
  );
};

export function getDateRange({
  range,
  mode = "recent",
}: {
  range: DateRange;
  mode?: "recent" | "previous";
}): { start?: Date; end?: Date } {
  const now = new Date();

  switch (range) {
    case DateRange.DAY: {
      if (mode === "previous") {
        const start = startOfDay(subDays(now, 1));
        const end = endOfDay(subDays(now, 1));
        return { start, end };
      }
      return { start: startOfDay(now), end: endOfDay(now) };
    }

    case DateRange.WEEK: {
      if (mode === "previous") {
        // Get start of current week, then subtract one week
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
        const start = startOfWeek(subWeeks(currentWeekStart, 1), {
          weekStartsOn: 1,
        });
        const end = endOfWeek(subWeeks(currentWeekStart, 1), {
          weekStartsOn: 1,
        });
        return { start, end };
      }
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    }

    case DateRange.MONTH: {
      if (mode === "previous") {
        const currentMonthStart = startOfMonth(now);
        const start = startOfMonth(subMonths(currentMonthStart, 1));
        const end = endOfMonth(subMonths(currentMonthStart, 1));
        return { start, end };
      }
      return { start: startOfMonth(now), end: endOfMonth(now) };
    }

    case DateRange.QUARTER: {
      if (mode === "previous") {
        const currentQuarterStart = startOfQuarter(now);
        const start = startOfQuarter(subQuarters(currentQuarterStart, 1));
        const end = endOfQuarter(subQuarters(currentQuarterStart, 1));
        return { start, end };
      }
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    }

    case DateRange.ANNUAL: {
      if (mode === "previous") {
        const currentYearStart = startOfYear(now);
        const start = startOfYear(subYears(currentYearStart, 1));
        const end = endOfYear(subYears(currentYearStart, 1));
        return { start, end };
      }
      return { start: startOfYear(now), end: endOfYear(now) };
    }
  }
}

export function currencyFormatter(data: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  return formatter.format(data);
}
