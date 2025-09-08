"use client";

import {
  BookIcon,
  BookUser,
  HomeIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  ListIcon,
  MessageSquareHeartIcon,
  PackageIcon,
  ShoppingBagIcon,
  Users2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "~/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import type { MenuItemType } from "~/types/component";

const AppSidebar = () => {
  const router = useRouter();
  const items: MenuItemType[] = [
    {
      name: "home",
      label: "Home",
      icon: HomeIcon,
      action: () => router.push("/admin"),
    },
    {
      name: "users",
      label: "Users",
      icon: Users2Icon,
      action: () => router.push("/admin"),
    },
    {
      name: "books",
      label: "Books",
      icon: BookIcon,
      action: () => router.push("/admin/books"),
    },
    {
      name: "inventory",
      label: "Inventory",
      icon: PackageIcon,
      action: () => router.push("/admin/inventory"),
    },
    {
      name: "authors",
      label: "Authors",
      icon: BookUser,
      action: () => router.push("/authors"),
    },
    {
      name: "purchases",
      label: "Purchases",
      icon: ShoppingBagIcon,
      action: () => router.push("/admin"),
    },
    {
      name: "categories",
      label: "Categories",
      icon: ListIcon,
      action: () => router.push("/admin/categories"),
    },

    {
      name: "collections",
      label: "Collections",
      icon: LibraryIcon,
      action: () => router.push("/admin"),
    },

    {
      name: "reviews",
      label: "Reviews",
      icon: MessageSquareHeartIcon,
      action: () => router.push("/admin"),
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Logo showLabel showSlogan />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="text-muted-foreground flex flex-row items-center justify-start gap-2">
            <LayoutDashboardIcon className="!size-4" />
            <p className="text-sm">DASHBOARD</p>
          </div>

          <SidebarGroupContent className="p-2">
            <SidebarMenu className="">
              {items.map((item) => (
                <SidebarMenuButton
                  className="hover:text-primary cursor-pointer"
                  key={item.name}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    }
                  }}
                >
                  {item.icon && <item.icon />}
                  {item.label}
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
