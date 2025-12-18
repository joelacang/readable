// SelectAuthor.tsx
import React, { useMemo, useState } from "react";
import { type MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useDebounced } from "~/hooks/use-debounced";
import { api } from "~/trpc/react";
import type { Option } from "~/types/component";
import { selectMultiStyle } from "~/styles/react-select";
import { sanitizeInput } from "~/utils/get-values";
import toast from "react-hot-toast";

interface TagSelectProps {
  onSelectTags: (tags: Option[]) => void;
  tagsSelected: Option[];
}

export const TagSelect = ({ onSelectTags, tagsSelected }: TagSelectProps) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedName = useDebounced(sanitizeInput(searchValue), 300);

  const { mutate: createTag, isPending } = api.tag.create.useMutation();

  const { data: tags = [], isLoading } = api.tag.searchTags.useQuery(
    { name: debouncedName },
    {
      enabled: debouncedName.length > 0,
    },
  );

  const options: Option[] = useMemo(() => {
    return tags.map((tag) => ({
      value: tag.id,
      label: `#${tag.name}`,
      mode: "create",
    }));
  }, [tags]);

  const handleChange = (options: MultiValue<Option>) => {
    const unique = Array.from(
      new Map(options.map((opt) => [opt.value, opt])).values(),
    );
    onSelectTags(unique);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const sanitized = sanitizeInput(searchValue);
      if (sanitized.length > 0) {
        handleCreate(sanitized);
      }
    }
  };

  const handleCreate = (input: string) => {
    const sanitized = sanitizeInput(input);

    if (!sanitized) return;

    const alreadyExists = tagsSelected.some(
      (tag) => tag.label.toLowerCase() === sanitized,
    );
    if (alreadyExists) {
      toast.error("Tag already selected.");
      return;
    }

    const createTagToast = toast.loading(`Adding tag: #${sanitized}...`);

    createTag(
      { name: sanitized },
      {
        onSuccess: (response) => {
          if (response) {
            const isDuplicate = tagsSelected.some(
              (tag) => tag.value === response.id,
            );

            if (!isDuplicate) {
              onSelectTags([
                ...tagsSelected,
                {
                  label: `#${response.name}`,
                  value: response.id,
                  mode: "create",
                },
              ]);
              toast.success(`Tag ${response.name} created.`);
            }
          }
        },
        onError: (error) => {
          toast.error(`Error creating tag: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss(createTagToast);
        },
      },
    );
  };

  const handleInputState = (inputValue: string) => {
    const sanitized = sanitizeInput(inputValue);
    setSearchValue(sanitized);

    return sanitized;
  };

  return (
    <div className="w-full">
      <CreatableSelect
        className="w-full"
        options={options}
        styles={selectMultiStyle}
        isDisabled={isPending}
        onKeyDown={handleKeyDown}
        isMulti
        onChange={handleChange}
        value={tagsSelected}
        onInputChange={handleInputState}
        isValidNewOption={(inputValue) => {
          // Only allow creation if input matches the debouncedName,
          // which means user paused typing for 800ms
          return inputValue === debouncedName && inputValue.trim().length > 0;
        }}
        onCreateOption={handleCreate}
        isLoading={isLoading}
        formatCreateLabel={(value) => `Create tag: ${value}`}
        placeholder="Enter Tag"
        isClearable
        noOptionsMessage={() =>
          debouncedName.length === 0 ? (
            "Enter tag to search"
          ) : (
            <p className="text-muted-foreground text-sm">
              No tags found for&nbsp;
              <span className="text-primary font-medium">{`"${debouncedName}"`}</span>
            </p>
          )
        }
      />
    </div>
  );
};
