"use client";

import Logo from "~/components/logo";
import { SidebarTrigger } from "~/components/ui/sidebar";
import UserDropdownMenu from "~/features/users/components/user-dropdown-menu";
import { useIsMobile } from "~/hooks/use-mobile";

const NavbarAdminContent = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-start gap-2">
        <SidebarTrigger />
        <Logo showLabel={!isMobile} />
      </div>

      <UserDropdownMenu />
    </div>
  );
};

export default NavbarAdminContent;
