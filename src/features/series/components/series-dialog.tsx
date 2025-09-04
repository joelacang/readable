import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useSeriesDialog } from "../hooks/use-series-dialog";
import { useConfirmationAlert } from "~/features/dialogs/hooks/use-confirm-dialog";
import { HelpCircleIcon } from "lucide-react";
import SeriesForm from "./series-form";

const SeriesDialog = () => {
  const { open, onClose, isPending, isValid } = useSeriesDialog();
  const { onOpen: openConfirmationAlert } = useConfirmationAlert();

  const handleClose = () => {
    if (isPending) {
      return;
    }

    if (isValid) {
      openConfirmationAlert({
        title: "Discard Changes?",
        message:
          "Are you sure you want to close the form? All unsaved changes will be lost.",
        icon: HelpCircleIcon,
        mode: "destructive",
        enableConfirmation: false,
        action: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Book Series</DialogTitle>
          <DialogDescription>
            Create a new book series to group related titles together. You can
            add books to this series after it&apos;s created.
          </DialogDescription>
        </DialogHeader>
        <SeriesForm />
      </DialogContent>
    </Dialog>
  );
};

export default SeriesDialog;
