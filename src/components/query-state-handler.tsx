import Centered from "~/features/page/components/centered";
import {
  ConfirmationType,
  type QueryStateHandlerProps,
} from "~/types/component";
import Loading from "./loading";
import MessageBox from "./message-box";
import { SearchXIcon, TriangleAlertIcon } from "lucide-react";

export function QueryStateHandler<T>({
  isLoading,
  isError,
  data,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorMessage,
  children,
}: QueryStateHandlerProps<T>) {
  if (isLoading) {
    return (
      <Centered>
        <Loading label={loadingLabel} />
      </Centered>
    );
  }

  if (isError) {
    return (
      <Centered>
        <MessageBox
          title={errorTitle ?? "An error occurred."}
          description={errorMessage ?? "Something went wrong."}
          icon={TriangleAlertIcon}
          mode={ConfirmationType.ERROR}
        />
      </Centered>
    );
  }

  if (!data) {
    return (
      <Centered>
        <MessageBox
          title={emptyTitle ?? "No Data Found."}
          description={emptyDescription}
          icon={SearchXIcon}
          mode={ConfirmationType.DEFAULT}
        />
      </Centered>
    );
  }
  return <div className="w-full">{children(data)}</div>;
}
