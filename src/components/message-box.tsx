import type { LucideIcon } from "lucide-react";
import React, { type HTMLProps } from "react";
import { cn } from "~/lib/utils";
import { ConfirmationType } from "~/types/component";

export type StatusColorType = {
  bg: string;
  border: string;
  iconColor: string;
  titleColor: string;
  descColor: string;
};

interface MessageBoxProps extends HTMLProps<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: LucideIcon;
  mode?: ConfirmationType;
  isCompact?: boolean;
  className?: string;
}
const MessageBox = ({
  title,
  description,
  children,
  icon: Icon,
  mode = ConfirmationType.DEFAULT,
  isCompact = false,
  className = "",
  ...props
}: MessageBoxProps) => {
  // Define mode-specific styles
  const modeStyles: Record<ConfirmationType, StatusColorType> = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      descColor: "text-green-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      descColor: "text-red-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      descColor: "text-blue-700",
    },
    default: {
      bg: "bg-muted/50",
      border: "border",
      iconColor: "text-primary",
      titleColor: "text-primary",
      descColor: "text-primary",
    },
  };

  const styles = modeStyles[mode] || modeStyles.default;

  return (
    <div className="w-full p-4">
      <div
        className={`w-full ${isCompact ? "max-w-sm" : "max-w-md"} mx-auto ${isCompact ? "p-4" : "p-6"} rounded-lg border ${styles.bg} ${styles.border} shadow-lg transition-all duration-200 ease-in-out ${isCompact ? "sm:max-w-md md:max-w-lg" : "sm:max-w-lg md:max-w-xl lg:max-w-2xl"} `}
      >
        {/* Icon and Title Section */}
        <div
          className={`flex items-center ${isCompact ? "justify-start" : "justify-center"} ${isCompact ? "mb-2" : "mb-4"}`}
        >
          {Icon && (
            <div
              className={`justify-centerrounded-full flex items-center rounded-full p-3 ${styles.bg} border ${styles.border} ${isCompact ? "mr-3 mb-0" : "mb-2"} `}
            >
              <Icon
                className={`${isCompact ? "h-4 w-4" : "h-10 w-10"} ${styles.iconColor}`}
              />
            </div>
          )}

          {/* Title - inline for compact mode */}
          {isCompact && (
            <h2
              className={`text-sm font-semibold ${styles.titleColor} sm:text-base`}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Title - centered for regular mode */}
        {!isCompact && (
          <h2
            className={`mb-1 text-center text-xl font-semibold ${styles.titleColor} sm:text-2xl md:text-xl`}
          >
            {title}
          </h2>
        )}

        {/* Description */}
        <p
          className={` ${isCompact ? "text-left" : "text-center"} ${isCompact ? "mb-3" : "mb-6"} leading-relaxed ${styles.descColor} ${isCompact ? "text-xs sm:text-sm" : "text-xs sm:text-sm md:text-base"} `}
        >
          {description}
        </p>

        {/* Children Content */}
        <div className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
