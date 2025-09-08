import { MailIcon, PhoneIcon, UserIcon, XIcon } from "lucide-react";
import CloseButton from "~/components/close-button";
import Hint from "~/components/hint";
import { Button } from "~/components/ui/button";
import type { ContactType } from "~/zod-schemas/contact";

interface Props {
  contact: ContactType;
  onSelectContact?: (contact: ContactType) => void;
  selectable?: boolean;
  removable?: boolean;
  onRemoveContact?: (contactId: string) => void;
}

const ContactSearchResult = ({
  contact,
  selectable = false,
  removable = false,
  onSelectContact,
  onRemoveContact,
}: Props) => {
  return (
    <div
      className="hover:bg-almond-100 active:bg-almond-200 flex cursor-pointer flex-row items-center justify-between gap-4 px-4 py-2"
      onClick={(e) => {
        if (selectable && onSelectContact) {
          e.preventDefault();
          e.stopPropagation();
          onSelectContact(contact);
        }
      }}
    >
      <div className="flex flex-row items-start justify-start gap-4">
        <div className="hidden flex-shrink-0 sm:flex">
          <div className="from-almond-300 to-almond-700 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br shadow-sm">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="truncate font-semibold text-gray-900">
                {contact.name}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0 text-gray-400">
                <MailIcon size={16} className="text-blue-500" />
              </div>
              <p className="truncate text-sm leading-none text-gray-600">
                {contact.email}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0 text-gray-400">
                <PhoneIcon size={16} className="text-green-500" />
              </div>
              <p className="text-sm leading-none text-gray-600">
                {contact.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
      {removable && (
        <Hint label="Remove Contact">
          <CloseButton
            onClose={() => {
              if (onRemoveContact) {
                onRemoveContact(contact.id);
              }
            }}
          />
        </Hint>
      )}
    </div>
  );
};

export default ContactSearchResult;
