import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import type { MenuItemType } from "~/types/component";

interface Props {
  item: MenuItemType;
}

const CategoryDropdownMenuItem = ({ item }: Props) => {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (item.action) {
          item.action();
        }
      }}
    >
      {item.icon && <item.icon color={item.color} />}
      <DropdownMenuLabel className="line-clamp-1">
        {item.label}
      </DropdownMenuLabel>
    </DropdownMenuItem>
  );
};

export default CategoryDropdownMenuItem;
