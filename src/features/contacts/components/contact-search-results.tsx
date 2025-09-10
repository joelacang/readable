import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import ContactSearchResult from "./contact-search-result";
import type { ContactType } from "~/zod-schemas/contact";
import { useSearch } from "~/providers/search-provider";

interface Props {
  onSelectContact: (contact: ContactType) => void;
}

const ContactSearchResults = ({ onSelectContact }: Props) => {
  const { searchValue, setShowResults } = useSearch();
  const {
    data: contacts,
    isLoading,
    isError,
  } = api.contact.search.useQuery({ searchValue });

  return (
    <div className="bg-card z-50 max-h-44 w-full overflow-y-auto rounded-lg border py-4 shadow-sm">
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
                onHideResult={() => setShowResults(false)}
              />
            ))}
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default ContactSearchResults;
