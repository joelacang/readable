import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useAuthorDetail } from "../hooks/use-author-detail";
import AuthorDetails from "./author-details";

const AuthorDetailDialog = () => {
  const { authorId, open, onClose } = useAuthorDetail();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Author Details</DialogTitle>
          </DialogHeader>
        </DialogHeader>
        <div className="w-full">
          {authorId && <AuthorDetails authorId={authorId} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorDetailDialog;
