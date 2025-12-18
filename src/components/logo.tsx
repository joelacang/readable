"use client";

import { BookOpenIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props {
  showLabel?: boolean;
  orientation?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large";
  showSlogan?: boolean;
  className?: string;
}
const Logo = ({
  showLabel = false,
  orientation = "horizontal",
  size = "medium",
  showSlogan = false,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "flex w-fit items-center justify-center",
        orientation === "vertical" ? "flex-col gap-1" : "flex-row gap-2",
        className,
      )}
    >
      <div
        className={cn(
          "from-almond-200 to-almond-700 text-almond-50 flex w-fit items-center justify-center rounded-full bg-gradient-to-br",
          size === "large" ? "p-4" : "p-2",
        )}
      >
        <BookOpenIcon
          className={cn(
            size === "small"
              ? "!size-4"
              : size === "medium"
                ? showSlogan
                  ? "!size-7"
                  : "!size-6"
                : "!size-12",
          )}
        />
      </div>

      {showLabel && (
        <div className="flex w-full flex-col items-start justify-center gap-0">
          <p
            className={cn(
              "text-almond-500 font-poppins leading-none font-black",
              showSlogan ? "text-xl" : "text-3xl",
            )}
          >
            readable
          </p>
          {showSlogan && (
            <p className="text-primary text-xs leading-none">
              Write・Read・Inspire
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
