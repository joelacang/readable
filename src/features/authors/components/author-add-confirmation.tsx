import { CheckCircle2Icon, CheckIcon } from "lucide-react";
import MessageBox from "~/components/message-box";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { ConfirmationType } from "~/types/component";
import { useAuthorFormDialog } from "../hooks/use-author-form-dialog";

const AuthorAddedConfirmation = () => {
  const { reset, onClose } = useAuthorFormDialog();
  return (
    <div>
      <MessageBox
        title="Author successfully added"
        description="Author was successfully added to our database"
        icon={CheckCircle2Icon}
        mode={ConfirmationType.SUCCESS}
      />
      <DialogFooter className="pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="button" onClick={reset}>
          Add Another
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AuthorAddedConfirmation;
