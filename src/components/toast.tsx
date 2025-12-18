import { type LucideIcon } from "lucide-react";
import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";
import { ModeType } from "~/types/component";
import { ModeDetails } from "~/utils/get-values";

interface Props extends HTMLProps<HTMLDivElement> {
  title: string;
  message?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  mode?: ModeType;
}
const Toast = ({
  title,
  message,
  icon,
  children,
  className,
  footer,
  mode = ModeType.DEFAULT,
  ...props
}: Props) => {
  const modeDetails = ModeDetails[mode];
  const Icon = icon ?? modeDetails.icon;

  return (
    <div
      role="alert"
      className={cn(
        "bg-card flex max-w-md flex-row gap-3 rounded-lg border p-4 shadow-md",
        className,
      )}
      {...props}
    >
      <div className="py-2">
        <Icon className={cn("h-8 w-8")} color={modeDetails.color} />
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col">
          <h3
            className={cn(
              mode === ModeType.ERROR ? "text-destructive" : "text-foreground",
              "text-base font-semibold",
            )}
          >
            {title}
          </h3>
          {message && (
            <p className="text-muted-foreground text-sm">{message}</p>
          )}

          {children && <div className="w-full">{children}</div>}
        </div>

        {footer && (
          <div className="flex w-full items-center justify-end">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Toast;
