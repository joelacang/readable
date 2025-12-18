import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";

interface FormGroupProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FormGroup = ({ children, className, ...props }: FormGroupProps) => {
  return (
    <div className={cn("@container pb-6", className)} {...props}>
      <div className="flex flex-col @2xl:flex-row">{children}</div>
    </div>
  );
};

export default FormGroup;
