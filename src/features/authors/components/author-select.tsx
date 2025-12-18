// SelectAuthor.tsx
import React, { useMemo, useState } from "react";
import Select, {
  type GroupBase,
  type MenuListProps,
  type MultiValue,
} from "react-select";
import { useDebounced } from "~/hooks/use-debounced";
import { api } from "~/trpc/react";
import type { Option } from "~/types/component";
import { SelectFooter } from "./author-select-footer";
import { selectMultiStyle } from "~/styles/react-select";

interface SelectAuthorProps {
  onSelectAuthors: (authors: Option[]) => void;
  authorsSelected: Option[];
}

export const SelectAuthor = ({
  onSelectAuthors,
  authorsSelected,
}: SelectAuthorProps) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedName = useDebounced(searchValue.trim(), 500);

  const menuListWithFooter = (selectInput: string) => {
    const MenuListWithFooter = (
      props: MenuListProps<Option, true, GroupBase<Option>>,
    ) => <SelectFooter {...props} selectInput={selectInput} />;

    MenuListWithFooter.displayName = "MenuListWithFooter";

    return MenuListWithFooter;
  };

  const { data: authors = [], isLoading } = api.author.searchAuthor.useQuery(
    { name: debouncedName },
    { enabled: debouncedName.trim().length > 0 },
  );

  const options: Option[] = useMemo(() => {
    return authors.map((author) => ({
      value: author.id,
      label: author.name,
      mode: "create",
    }));
  }, [authors]);

  const handleChange = (options: MultiValue<Option>) => {
    const unique = Array.from(
      new Map(options.map((opt) => [opt.value, opt])).values(),
    );
    onSelectAuthors(unique);
  };

  const handleInputState = (inputValue: string) => {
    setSearchValue(inputValue);
  };

  return (
    <div className="w-full">
      <Select
        className="w-full"
        options={options}
        styles={selectMultiStyle}
        isMulti
        onChange={handleChange}
        value={authorsSelected}
        inputId={searchValue}
        onInputChange={handleInputState}
        isLoading={isLoading}
        placeholder="Enter Author Name"
        isClearable
        noOptionsMessage={() =>
          debouncedName.length === 0 ? (
            "Enter author's name to search"
          ) : (
            <p className="text-muted-foreground text-sm">
              No authors found for&nbsp;
              <span className="text-primary font-medium">{`"${debouncedName}"`}</span>
            </p>
          )
        }
        components={{
          MenuList: menuListWithFooter(debouncedName),
        }}
      />
    </div>
  );
};
