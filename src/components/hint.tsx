import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  children: React.ReactNode;
  label?: string;
}
const Hint = ({ children, label }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{label ?? "Tooltip Here..."}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
