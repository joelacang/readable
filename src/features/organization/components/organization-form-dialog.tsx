import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useOrgFormDialog } from "../hooks/use-org-form-dialog";
import OrganizationForm from "./organization-form";

const OrganizationFormDialog = () => {
  const { open, onOpen, onClose, isPending } = useOrgFormDialog();
  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) => {
        if (isPending) return null;

        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <OrganizationForm />
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationFormDialog;
