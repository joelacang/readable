import React, { useMemo, useState } from "react";
import Select, {
  type GroupBase,
  type MenuListProps,
  type MultiValue,
} from "react-select";
import { useDebounced } from "~/hooks/use-debounced";
import { api } from "~/trpc/react";
import type { CategoryOptionType } from "~/types/categories";
import { CategorySelectFooter } from "./category-select-footer";
import { selectMultiStyle } from "~/styles/react-select";
import type { Option } from "~/types/component";

interface SelectCategoryProps {
  onSelectCategories: (categories: Option[]) => void;
  categoriesSelected: Option[];
}

export const CategorySelect = ({
  onSelectCategories,
  categoriesSelected,
}: SelectCategoryProps) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedName = useDebounced(searchValue, 500);

  const menuListWithFooter = (selectInput: string) => {
    const MenuListWithFooter = (
      props: MenuListProps<Option, true, GroupBase<Option>>,
    ) => <CategorySelectFooter {...props} selectInput={selectInput} />;

    MenuListWithFooter.displayName = "MenuListWithFooter";

    return MenuListWithFooter;
  };

  const { data: fetchedCategories = [], isLoading } =
    api.category.searchCategory.useQuery(
      { name: debouncedName },
      { enabled: debouncedName.length > 0 },
    );

  const options: Option[] = useMemo(() => {
    return fetchedCategories.map((category: CategoryOptionType) => ({
      value: category.id,
      label: category.name,
      mode: "create",
    }));
  }, [fetchedCategories]);

  const handleChange = (options: MultiValue<Option>) => {
    // Optional: deduplicate by value
    const unique = Array.from(
      new Map(options.map((opt) => [opt.value, opt])).values(),
    );

    onSelectCategories(unique);
  };

  const handleInputState = (inputValue: string) => {
    setSearchValue(inputValue);
  };

  return (
    <Select
      styles={selectMultiStyle}
      className="w-full"
      options={options}
      isMulti
      onChange={handleChange}
      value={categoriesSelected}
      inputId={searchValue}
      onInputChange={handleInputState}
      isLoading={isLoading}
      placeholder="Enter Book Category"
      isClearable
      noOptionsMessage={() =>
        debouncedName.length === 0 ? (
          "Enter category name to search"
        ) : (
          <p className="text-muted-foreground text-sm">
            No categories found for&nbsp;
            <span className="text-primary font-medium">{`"${debouncedName}"`}</span>
          </p>
        )
      }
      components={{
        MenuList: menuListWithFooter(debouncedName),
      }}
    />
  );
};
