import { PlusIcon, SearchIcon, UserSearchIcon } from "lucide-react";
import InputIcon from "~/components/input-icon";
import { Button } from "~/components/ui/button";
import { useContactFormDialog } from "../hooks/use-contact-form-dialog";
import { useDebounced } from "~/hooks/use-debounced";
import { useEffect, useRef, useState } from "react";
import ContactSearchResults from "./contact-search-results";
import type { ContactType } from "~/zod-schemas/contact";
import ContactSearchResult from "./contact-search-result";

interface Props {
  orgTempId: string;
  value: string[];
  onChange: (ids: string[]) => void;
}
const ContactPersonForm = ({ orgTempId, value, onChange }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [selectedContacts, setSelectedContacts] = useState<ContactType[]>([]);

  const debouncedName = useDebounced(searchText.trim(), 800);

  const { onOpenOrgContact } = useContactFormDialog();

  useEffect(() => {
    if (debouncedName) {
      setShowSearchResults(true);
    }
  }, [debouncedName]);

  //Click Outside Search Results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onChange(selectedContacts.map((c) => c.id));
  }, [selectedContacts, onChange]);

  const handleSelectContact = (contact: ContactType) => {
    setSelectedContacts((prev) => {
      if (prev.some((c) => c.id === contact.id)) {
        return prev;
      }
      const updated = [...prev, contact];

      return updated;
    });
    setShowSearchResults(false);
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts((prev) => prev.filter((c) => c.id !== contactId));
  };
  return (
    <div className="space-y-4 rounded-lg border p-3">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="relative w-full">
          <InputIcon
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
            icon={SearchIcon}
            placeholder="Search Contact Name"
            onClick={() => {
              if (debouncedName && !showSearchResults) {
                setShowSearchResults(true);
              }
            }}
          />

          {debouncedName && showSearchResults && (
            <div
              className="absolute top-full z-10 mt-1 w-full"
              ref={searchResultsRef}
            >
              <ContactSearchResults
                searchValue={debouncedName}
                onSelectContact={handleSelectContact}
              />
            </div>
          )}
        </div>

        <Button
          type="button"
          size="icon"
          onClick={() => onOpenOrgContact(orgTempId)}
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border">
        {selectedContacts.length ? (
          <div className="text-muted-foreground w-full space-y-2 py-4 font-mono text-sm">
            <p className="px-4">
              <span className="text-primary font-semibold">
                {selectedContacts.length}
              </span>
              &nbsp;Contact
              {selectedContacts.length !== 1 ? "s" : ""}&nbsp;Selected.
            </p>
            <div className="max-h-56 overflow-y-auto">
              {selectedContacts.map((contact) => (
                <ContactSearchResult
                  key={contact.id}
                  contact={contact}
                  removable
                  onRemoveContact={handleRemoveContact}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <UserSearchIcon className="text-primary size-10" />
            <p className="text-primary max-w-64 text-center text-xs">
              No contacts selected. Use the search box or click &apos;
              <span className="font-semibold">Add Contact</span>&apos; to
              continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPersonForm;
