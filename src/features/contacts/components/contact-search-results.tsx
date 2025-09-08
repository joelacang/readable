import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import ContactSearchResult from "./contact-search-result";
import type { ContactType } from "~/zod-schemas/contact";

interface Props {
  searchValue: string;
  onSelectContact: (contact: ContactType) => void;
}

const ContactSearchResults = ({ searchValue, onSelectContact }: Props) => {
  const {
    data: contacts,
    isLoading,
    isError,
  } = api.contact.search.useQuery({ searchValue });

  return (
    <div className="bg-background z-50 max-h-44 overflow-y-auto rounded-lg border py-4 shadow-sm">
      <QueryStateHandler
        data={contacts}
        isLoading={isLoading}
        isError={isError}
        loadingLabel={`Searching for contact: '${searchValue}'...`}
      >
        {(contacts) => (
          <div className="space-y-1">
            <p className="px-4 text-sm">
              <span className="text-primary font-mono font-semibold">
                {contacts.length}
              </span>
              &nbsp; Search Result
              {contacts.length !== 1 ? "s" : ""} for:&nbsp;
              <span className="text-primary font-semibold">
                &apos;{searchValue}&apos;
              </span>
            </p>
            {contacts.map((contact) => (
              <ContactSearchResult
                onSelectContact={onSelectContact}
                key={contact.id}
                contact={contact}
                selectable
              />
            ))}
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default ContactSearchResults;
