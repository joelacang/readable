"use client";
import { ConfirmationType } from "~/types/component";
import MessageBox from "~/components/message-box";
import { HomeIcon, LockIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import Logo from "~/components/logo";
import { api } from "~/trpc/react";

interface Props {
  children: React.ReactNode;
}

const AdminPageAuthCheck = ({ children }: Props) => {
  const {
    data: isAdmin,
    isPending,
    isError,
    error,
  } = api.user.isAdmin.useQuery();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Logo orientation="vertical" size="large" showLabel />
          <p className="text-muted-foreground text-xs">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <MessageBox
          title="Something went wrong."
          description={error.message}
          mode={ConfirmationType.ERROR}
          icon={LockIcon}
        >
          <div className="flex items-center justify-center">
            <Button onClick={() => router.push("/")}>
              <HomeIcon /> Go to Home
            </Button>
          </div>
        </MessageBox>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <MessageBox
          title="Unauthorized"
          description="Access Denied: You must be an admin to view this page."
          mode={ConfirmationType.ERROR}
          icon={LockIcon}
        >
          <div className="flex items-center justify-center">
            <Button onClick={() => router.push("/")}>
              <HomeIcon /> Go to Home
            </Button>
          </div>
        </MessageBox>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminPageAuthCheck;
