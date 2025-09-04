import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";

interface FormGroupContentProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const FormGroupContent = ({
  className,
  children,
  ...props
}: FormGroupContentProps) => {
  return (
    <div className={cn("w-full space-y-4 space-x-4 p-4", className)} {...props}>
      {children}
    </div>
  );
};

export default FormGroupContent;
