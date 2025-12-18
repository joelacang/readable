import { components, type GroupBase, type MenuListProps } from "react-select";
import type { Option } from "~/types/component";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCategoryDialog } from "../hooks/use-category-dialog";

interface SelectFooterProps
  extends MenuListProps<Option, true, GroupBase<Option>> {
  selectInput: string;
}

export const CategorySelectFooter = (props: SelectFooterProps) => {
  const { selectInput } = props;
  const { onOpenName } = useCategoryDialog();

  return (
    <components.MenuList {...props}>
      {props.children}

      <div className="border-muted bottom-0 z-10 flex flex-col items-start gap-2 border-t px-2 py-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-blue-50"
          onClick={() => {
            onOpenName(selectInput);
          }}
        >
          <PlusIcon className="h-4 w-4" />
          {selectInput ? (
            <p>
              Add category named&nbsp;
              <span className="font-semibold">{`"${selectInput}"`}</span>
            </p>
          ) : (
            <p>Add New Category</p>
          )}
        </Button>
      </div>
    </components.MenuList>
  );
};
