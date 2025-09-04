import { Loader2Icon, PlusIcon, SaveIcon, TrashIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface FormActionButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  mode?: "create" | "update" | "delete";
  children?: React.ReactNode;
  isPending?: boolean;
}
const FormActionButton = ({
  mode = "create",
  isPending = false,
  children,
  ...props
}: FormActionButtonProps) => {
  const labelMap = {
    create: isPending ? "Creating..." : "Create",
    update: isPending ? "Updating..." : "Update",
    delete: isPending ? "Deleting..." : "Delete",
  } as const;
  const iconMap = {
    create: PlusIcon,
    update: SaveIcon,
    delete: TrashIcon,
  } as const;
  const label = children ?? labelMap[mode];
  const Icon = isPending ? Loader2Icon : iconMap[mode];

  return (
    <Button
      type="submit"
      disabled={isPending}
      variant={mode === "delete" ? "destructive" : "default"}
      {...props}
    >
      {Icon && <Icon className={cn("h-4 w-4", isPending && "animate-spin")} />}
      {label}
    </Button>
  );
};

export default FormActionButton;
