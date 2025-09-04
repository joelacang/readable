import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isCentered?: boolean;
}
const TableCell = ({ children, className, isCentered, ...props }: Props) => {
  return (
    <div
      className={cn(
        "flex px-2",
        isCentered && "items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default TableCell;
