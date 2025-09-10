import { XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface Props {
  onClose: () => void;
  isPending?: boolean;
  className?: string;
}
const CloseButton = ({ onClose, isPending = false, className }: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-fit rounded-full p-2", className)}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <XIcon />
    </Button>
  );
};

export default CloseButton;
