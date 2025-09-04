import { UploadIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

const EmptyImages = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="pointer-events-none flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <UploadIcon className="text-primary size-10" />
        <p className="text-center text-sm font-medium">
          Drag & drop or click to upload images
        </p>
      </div>
      <div className="pointer-events-auto">
        <Button type="button" variant="default" onClick={onClick}>
          Browse Files
        </Button>
      </div>
    </div>
  );
};

export default EmptyImages;
