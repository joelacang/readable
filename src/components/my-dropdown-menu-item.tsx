import { type DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import type { MenuItemType } from "~/types/component";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface MyDropdownMenuItemProps extends DropdownMenuItemProps {
  item: MenuItemType;
}
const MyDropdownMenuItem = ({ item, ...props }: MyDropdownMenuItemProps) => {
  const Icon = item.icon;
  return (
    <>
      {item.hasUpperSeparator && <DropdownMenuSeparator className="my-1" />}
      {!item.hidden && (
        <DropdownMenuItem
          {...props}
          disabled={item.disabled}
          className={cn(
            item.className,
            "flex w-full cursor-pointer flex-row items-center justify-between gap-4 rounded-lg",
            item.isDestructive && "focus:bg-destructive focus:text-white",
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (item.action) {
              item.action();
            }
          }}
        >
          <DropdownMenuLabel className="line-clamp-1">
            {item.label}
          </DropdownMenuLabel>

          {Icon && (
            <Icon
              className={cn(
                "h-4 w-4",
                item.isDestructive && "focus:text-white",
              )}
            />
          )}
        </DropdownMenuItem>
      )}
    </>
  );
};

export default MyDropdownMenuItem;
