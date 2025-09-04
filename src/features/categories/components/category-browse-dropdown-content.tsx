import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import type { MenuItemType } from "~/types/component";
import CategoryDropdownMenuItem from "./category-dropdown-menu-item";
import { useRouter } from "next/navigation";

interface Props {
  items: MenuItemType[];
}

const CategoryBrowseDropdownContent = ({ items }: Props) => {
  const router = useRouter();
  return (
    <>
      {items.map((item) => {
        if (item.subMenus && item.subMenus.length > 0) {
          return (
            <DropdownMenuSub key={item.name}>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <div className="flex flex-row items-center justify-start gap-3 py-2">
                  {item.icon && (
                    <item.icon className="!size-4" color={item.color} />
                  )}
                  {item.label}
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-72 p-2">
                  <CategoryDropdownMenuItem
                    item={{
                      name: item.name,
                      label: "All " + item.label + " Books",
                      color: item.color,
                      icon: item.icon,
                      action: () => router.push(`/categories/${item.name}`),
                    }}
                  />
                  <CategoryBrowseDropdownContent items={item.subMenus} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          );
        } else {
          return <CategoryDropdownMenuItem key={item.name} item={item} />;
        }
      })}
    </>
  );
};

export default CategoryBrowseDropdownContent;
