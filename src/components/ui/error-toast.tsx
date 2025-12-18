import { LockIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react";
import Toast from "../toast";
import { Button } from "./button";
import { ModeType } from "~/types/component";

interface Props {
  code: string;
  title?: string;
  message?: string;
  icon?: LucideIcon;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const ErrorToast = ({ code, title, message, footer, icon }: Props) => {
  const Icon: LucideIcon =
    code === "UNAUTHORIZED" ? LockIcon : (icon ?? TriangleAlertIcon);

  const errorFooter =
    code === "UNAUTHORIZED" ? (
      <Button>
        <LockIcon />
        Sign In
      </Button>
    ) : (
      footer
    );
  return (
    <Toast
      title={title ?? "An error occurred."}
      message={message}
      icon={Icon}
      footer={errorFooter}
      mode={ModeType.ERROR}
    />
  );
};

export default ErrorToast;
