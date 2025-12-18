import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import {
  LayoutDashboardIcon,
  LibraryIcon,
  ListIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  StoreIcon,
  UserIcon,
} from "lucide-react";
import { Size, type MenuItemType } from "~/types/component";
import MyDropdownMenuItem from "~/components/my-dropdown-menu-item";
import { useLoggedUser } from "../hooks/use-logged-user";
import { authClient } from "~/lib/auth-client";
import toast from "react-hot-toast";
import { useState } from "react";
import SignInButton from "./sign-in-button";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";

const UserDropdownMenu = () => {
  const { loggedUser: user, removeLoggedUser, isLoading } = useLoggedUser();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (!user) {
    return <SignInButton />;
  }

  if (isLoading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  const items: MenuItemType[] = [
    {
      name: "go-admin-dashboard",
      label: "Go to Admin Dashboard",
      icon: LayoutDashboardIcon,
      hidden: user.role !== "ADMIN" || pathname.startsWith("/admin"),
      disabled: user.role !== "ADMIN" || isPending,
      action: () => {
        router.push("/admin");
      },
    },
    {
      name: "go-to-store",
      label: "Go to Store",
      icon: StoreIcon,
      hidden: !pathname.startsWith("/admin"),
      disabled: user.role !== "ADMIN" || isPending,
      action: () => {
        router.push("/");
      },
    },
    {
      name: "my-library",
      label: "My Library",
      icon: LibraryIcon,
      hasUpperSeparator: true,
      action: () => router.push(`/user/orders/my-orders`),
    },
    {
      name: "my-orders",
      label: "My Orders",
      icon: ListIcon,
      action: () => router.push(`/user/orders/my-orders`),
    },
    {
      name: "my-reviews",
      label: "My Reviews",
      icon: MessageCircleIcon,
      action: () => router.push(`/user/reviews/my-reviews`),
    },
    {
      name: "profile",
      label: "Profile",
      action: () => console.log("Profile clicked"),
      icon: UserIcon,
      disabled: isPending,
      hasUpperSeparator: true,
    },
    {
      name: "settings",
      label: "Settings",
      action: () => console.log("Settings clicked"),
      icon: SettingsIcon,
      disabled: isPending,
    },
    {
      name: "logout",
      label: "Logout",
      icon: LogOutIcon,
      hasUpperSeparator: true,
      disabled: isPending,
      action: () => {
        setIsPending(true);
        const logoutToast = toast.loading(`Logging Out ${user.name}...`);

        setTimeout(() => {
          authClient
            .signOut({})
            .then(() => {
              toast.success(`You have been logged out successfully.`);
              removeLoggedUser();
              window.location.href = "/";
            })
            .catch((error) => {
              toast.error(`Error logging out.`);
              console.log("Error logging out", error);
            })
            .finally(() => {
              setIsPending(false);
              toast.dismiss(logoutToast);
            });
        }, 2000);
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-fit cursor-pointer rounded-full"
          size="icon"
        >
          <UserAvatar user={user} size={Size.MEDiUM} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-xl">
        <DropdownMenuGroup className="flex flex-row items-center justify-start gap-4 px-3 py-4">
          <UserAvatar user={user} size={Size.LARGE} />
          <div className="space-y-1">
            <p className="line-clamp-1 leading-none font-semibold">
              {user.name}
            </p>
            <p className="text-muted-foreground line-clamp-1 text-xs">
              {user.username ?? "No Username"}
            </p>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <MyDropdownMenuItem key={item.name} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
