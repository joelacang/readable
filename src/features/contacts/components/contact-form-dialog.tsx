import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useContactFormDialog } from "../hooks/use-contact-form-dialog";
import ContactForm from "./contact-form";

const ContactFormDialog = () => {
  const { open, onClose, isPending, onOpen } = useContactFormDialog();
  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) => {
        if (isPending) return;

        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Contact</DialogTitle>
        </DialogHeader>

        <ContactForm />
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
