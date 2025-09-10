import { PlusIcon, SearchIcon, UserSearchIcon } from "lucide-react";
import InputIcon from "~/components/input-icon";
import { Button } from "~/components/ui/button";
import { useContactFormDialog } from "../hooks/use-contact-form-dialog";
import { useDebounced } from "~/hooks/use-debounced";
import { useEffect, useRef, useState } from "react";
import ContactSearchResults from "./contact-search-results";
import type { ContactType } from "~/zod-schemas/contact";
import ContactSearchResult from "./contact-search-result";
import { SearchProvider } from "~/providers/search-provider";
import SearchBar from "~/features/form/components/searchbar";

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
  const {
    addedContact,
    onOpenOrgContact,
    orgTempId: orgTempIdFromDialog,
    onRemoveContact,
  } = useContactFormDialog();

  const debouncedName = useDebounced(searchText.trim(), 800);

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

  useEffect(() => {
    if (addedContact && orgTempId === orgTempIdFromDialog) {
      setSelectedContacts((prev) => {
        const existing = prev.some((c) => c.id === addedContact.id);

        if (existing) return prev;

        return [...prev, addedContact];
      });

      onRemoveContact();
    }
  }, [addedContact, orgTempId, orgTempIdFromDialog]);

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
        <div className="w-full">
          <SearchProvider>
            <SearchBar placeholder="Enter Contact Name...">
              <ContactSearchResults onSelectContact={handleSelectContact} />
            </SearchBar>
          </SearchProvider>
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
