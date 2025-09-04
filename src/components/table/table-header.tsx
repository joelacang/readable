import type { HTMLProps } from "react";
import type React from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const TableHeader = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={cn("flex flex-row items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default TableHeader;
