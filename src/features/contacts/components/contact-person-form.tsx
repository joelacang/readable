import { PlusIcon, SearchIcon, UserSearchIcon } from "lucide-react";
import InputIcon from "~/components/input-icon";
import { Button } from "~/components/ui/button";
import { useContactFormDialog } from "../hooks/use-contact-form-dialog";

interface Props {
  orgTempId: string;
}
const ContactPersonForm = ({ orgTempId }: Props) => {
  const { onOpenOrgContact } = useContactFormDialog();
  return (
    <div className="space-y-4 rounded-lg border p-3">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex-1">
          <InputIcon icon={SearchIcon} placeholder="Search Contact Name" />
        </div>

        <Button
          type="button"
          size="icon"
          onClick={() => onOpenOrgContact(orgTempId)}
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="bg-almond-100 flex flex-col items-center justify-center space-y-4 rounded-lg border py-8">
        <UserSearchIcon className="text-primary size-10" />
        <p className="text-primary max-w-64 text-center text-xs">
          No contacts selected. Use the search box or click &apos;
          <span className="font-semibold">Add Contact</span>&apos; to continue.
        </p>
      </div>
    </div>
  );
};

export default ContactPersonForm;
