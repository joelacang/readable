import { TriangleAlertIcon } from "lucide-react";
import MessageBox from "~/components/message-box";
import { ModeType } from "~/types/component";

export default function NotFound() {
  return (
    <MessageBox
      title="Page Not Found"
      description="This page does not exist."
      icon={TriangleAlertIcon}
      mode={ModeType.ERROR}
    />
  );
}
