import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  onClose: () => void;
  isPending?: boolean;
}
const CloseButton = ({ onClose, isPending = false }: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-fit rounded-full p-2"
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
