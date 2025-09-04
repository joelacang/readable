import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";

interface FormGroupHeaderProps extends HTMLProps<HTMLDivElement> {
  title: string;
  description?: string;
  className?: string;
}
const FormGroupHeader = ({
  title,
  description,
  className,
  ...props
}: FormGroupHeaderProps) => {
  return (
    <div className={cn("w-full max-w-md", className)} {...props}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-base">{description}</p>
    </div>
  );
};

export default FormGroupHeader;
