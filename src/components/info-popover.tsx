import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { HelpCircleIcon, InfoIcon } from "lucide-react";

interface InfoPopoverProps {
  children: React.ReactNode;
}
const InfoPopover = ({ children }: InfoPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-fit" size="icon" variant="ghost">
          <InfoIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="text-muted-foreground w-full max-w-sm p-4 text-sm">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
