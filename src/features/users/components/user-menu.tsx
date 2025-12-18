/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import UserDropdownMenu from "./user-dropdown-menu";
import { useLoggedUser } from "../hooks/use-logged-user";
import { useEffect } from "react";

import toast from "react-hot-toast";

const UserMenu = () => {
  const {
    data: user,
    isPending,
    isError,
    error,
  } = api.user.getLoggedUser.useQuery();
  const { addLoggedUser, removeLoggedUser } = useLoggedUser();

  useEffect(() => {
    if (!isPending) {
      if (user) {
        addLoggedUser(user);
      } else {
        removeLoggedUser();
      }
    }
  }, [isPending, user]);

  if (isPending) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  if (isError) {
    toast.error(`Error loading your account: ${error.message}`);
  }

  return <UserDropdownMenu />;
};

export default UserMenu;
