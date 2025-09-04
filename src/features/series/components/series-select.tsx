// SeriesSelect.tsx
import React, { useMemo, useState } from "react";
import Select, {
  type GroupBase,
  type MenuListProps,
  type SingleValue,
} from "react-select";
import { useDebounced } from "~/hooks/use-debounced";
import { api } from "~/trpc/react";
import type { FormIdentityType, Option } from "~/types/component";
import { selectMultiStyle, selectSingleStyle } from "~/styles/react-select";
import { SeriesSelectFooter } from "./series-select-footer";

interface SelectSeriesProps {
  onSelectSeries: (series: Option | null) => void;
  seriesSelected: Option | null;
  formId: string;
}

export const SeriesSelect = ({
  onSelectSeries,
  seriesSelected,
  formId,
}: SelectSeriesProps) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedName = useDebounced(searchValue.trim(), 500);

  const menuListWithFooter = (selectInput: string) => {
    const MenuListWithFooter = (
      props: MenuListProps<Option, false, GroupBase<Option>>,
    ) => (
      <SeriesSelectFooter
        {...props}
        selectInput={selectInput}
        formId={formId}
      />
    );

    MenuListWithFooter.displayName = "MenuListWithFooter";

    return MenuListWithFooter;
  };

  const { data: series = [], isLoading } = api.series.searchSeries.useQuery(
    { name: debouncedName },
    { enabled: debouncedName.trim().length > 0 },
  );

  const options: Option[] = useMemo(() => {
    return series.map((currentSeries: FormIdentityType) => ({
      value: currentSeries.id,
      label: currentSeries.name,
      mode: "create",
    }));
  }, [series]);

  const handleChange = (option: SingleValue<Option>) => {
    onSelectSeries(option);
  };

  const handleInputState = (inputValue: string) => {
    setSearchValue(inputValue);
  };

  return (
    <div className="w-full">
      <Select
        className="w-full"
        options={options}
        styles={selectSingleStyle}
        onChange={handleChange}
        isMulti={false}
        value={seriesSelected}
        inputId={searchValue}
        onInputChange={handleInputState}
        isLoading={isLoading}
        placeholder="Enter Series Name"
        isClearable
        noOptionsMessage={() =>
          debouncedName.length === 0 ? (
            "Enter book series name to search"
          ) : (
            <p className="text-muted-foreground text-sm">
              No book series found for&nbsp;
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
