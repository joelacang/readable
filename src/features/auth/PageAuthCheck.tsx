"use client";

import { api } from "~/trpc/react";
import { useLoggedUser } from "../users/hooks/use-logged-user";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

const PageAuthCheck = ({ children }: Props) => {
  const { addLoggedUser, removeLoggedUser, onFinishedLoading, onLoading } =
    useLoggedUser();

  const {
    data: fetchedUser,
    isPending,
    isError,
    error,
  } = api.user.getLoggedUser.useQuery();

  useEffect(() => {
    if (isPending) {
      onLoading();
    }
  }, [isPending, onLoading]);

  useEffect(() => {
    if (!isPending) {
      onFinishedLoading();
      if (!fetchedUser) {
        removeLoggedUser();
      } else {
        const { id, name, image, username, role } = fetchedUser;
        addLoggedUser({ id, name, image, username, role });
      }
    }
  }, [
    fetchedUser,
    isPending,
    addLoggedUser,
    removeLoggedUser,
    onFinishedLoading,
  ]);

  if (isError) {
    toast.error(`Error loading logged user's information: ${error.message}`);
  }

  return <div className="flex w-full flex-col">{children}</div>;
};

export default PageAuthCheck;
