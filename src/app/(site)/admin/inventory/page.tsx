"use client";

import { UserPlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useContactFormDialog } from "~/features/contacts/hooks/use-contact-form-dialog";
import DashboardPage from "~/features/dashboard/components/dashboard-page";
import { useOrgFormDialog } from "~/features/organization/hooks/use-org-form-dialog";

const InventoryPage = () => {
  const { onOpen: onOpenContactForm } = useContactFormDialog();
  const { onOpen: onOpenOrgForm } = useOrgFormDialog();
  return (
    <DashboardPage title="Inventory" subtitle="All Inventory Data are here.">
      <div className="flex w-full items-center justify-end gap-2">
        <Button onClick={onOpenContactForm}>
          <UserPlusIcon />
          Add Contact
        </Button>
        <Button onClick={onOpenOrgForm}>Add Organization</Button>
      </div>
    </DashboardPage>
  );
};

export default InventoryPage;
