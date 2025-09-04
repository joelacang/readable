import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  onAddImage?: (open: boolean) => void;
}

const AddImageButton = ({ onAddImage }: Props) => {
  return (
    <Button
      type="button"
      onClick={() => {
        if (onAddImage) {
          onAddImage(true);
        }
      }}
    >
      <PlusIcon />
    </Button>
  );
};

export default AddImageButton;
