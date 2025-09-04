import { ChevronDownIcon, PencilIcon, SettingsIcon } from "lucide-react";
import MyDropdownMenuItem from "~/components/my-dropdown-menu-item";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { MenuItemType } from "~/types/component";

const BookAdminDropdownMenu = () => {
  const items: MenuItemType[] = [
    {
      name: "edit-book",
      label: "Edit Book",
      icon: PencilIcon,
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-primary hover:text-primary rounded-lg"
        >
          <SettingsIcon />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-6 w-56">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.name} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookAdminDropdownMenu;
