import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useAuthorFormDialog } from "../hooks/use-author-form-dialog";
import AuthorForm from "./author-form";
import AuthorAddedConfirmation from "./author-add-confirmation";
import { useConfirmationAlert } from "~/features/dialogs/hooks/use-confirm-dialog";
import { HelpCircleIcon } from "lucide-react";

const getAuthorDialogStrings = (mode: string) => {
  switch (mode) {
    case "create":
      return {
        title: "Add Author",
        description: "Enter information to add author",
      };
    case "edit":
      return {
        title: "Edit Author",
        description: "Enter information to edit author information",
      };
    case "saved":
      return {
        title: "Author Saved.",
        description: "Author was saved successfully to our database.",
      };

    default:
      return {
        title: "Invalid Mode.",
        description: "Error.",
      };
  }
};

const AuthorFormDialog = () => {
  const {
    open,
    onClose,
    mode,
    isValid: isFormValid,
    isPending: isFormPending,
  } = useAuthorFormDialog();
  const headerLabel = getAuthorDialogStrings(mode);
  const { onOpen: openConfirmDialog } = useConfirmationAlert();

  const handleClose = () => {
    if (isFormPending) {
      // Don't allow closing while submission is in progress
      return;
    }

    if (isFormValid) {
      // Warn the user before discarding valid input
      openConfirmDialog({
        title: "Discard Changes?",
        message:
          "Are you sure you want to close the form? All unsaved changes will be lost.",
        icon: HelpCircleIcon,
        mode: "destructive",
        enableConfirmation: false,
        action: () => {
          onClose(); // Actually close the dialog
        },
      });
    } else {
      // No valid input — just close it
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headerLabel.title}</DialogTitle>
          <DialogDescription>{headerLabel.description}</DialogDescription>
        </DialogHeader>
        {mode === "create" && <AuthorForm />}
        {mode === "saved" && <AuthorAddedConfirmation />}
      </DialogContent>
    </Dialog>
  );
};

export default AuthorFormDialog;
