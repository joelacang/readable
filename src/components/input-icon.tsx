import type { LucideIcon } from "lucide-react";
import { Input } from "./ui/input";
import type { HTMLProps } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLProps<HTMLInputElement> {
  className?: string;
  icon: LucideIcon;
}
const InputIcon = ({ className, icon: Icon, ...props }: Props) => {
  return (
    <div className="relative">
      <Input
        className={cn("h-10 w-full pl-8 font-mono text-sm", className)}
        {...props}
      />
      <div className="border-primary text-primary absolute top-2 left-1.5 rounded-full p-1">
        <Icon className="size-4" />
      </div>
    </div>
  );
};

export default InputIcon;
