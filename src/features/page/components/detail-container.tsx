import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  columns?: number;
}

function getColumns(col: number): string {
  switch (col) {
    case 1:
      return "";
    case 2:
      return "lg:grid-cols-2";
    case 3:
      return "lg:grid-cols-3";
    default:
      return "";
  }
}

const DetailContainer = ({
  children,
  className,
  columns = 1,
  ...props
}: Props) => {
  return (
    <div
      className={cn(getColumns(columns), "grid grid-cols-1 gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default DetailContainer;
