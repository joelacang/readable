import Centered from "~/features/page/components/centered";
import { ModeType, type QueryStateHandlerProps } from "~/types/component";
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
    if (typeof loadingLabel === "string") {
      return (
        <Centered>
          <Loading label={loadingLabel} />
        </Centered>
      );
    } else {
      return loadingLabel;
    }
  }

  if (isError) {
    if (errorTitle || errorMessage) {
      return (
        <Centered>
          <MessageBox
            title={errorTitle ?? "An error occured"}
            description={
              errorMessage ?? "Something went wrong. Please try again."
            }
            icon={TriangleAlertIcon}
            mode={ModeType.ERROR}
          />
        </Centered>
      );
    } else {
      return null;
    }
  }

  if (!data) {
    if (emptyDescription || emptyTitle) {
      return (
        <Centered>
          <MessageBox
            title={emptyTitle ?? "No Data Found."}
            description={emptyDescription}
            icon={SearchXIcon}
            mode={ModeType.DEFAULT}
          />
        </Centered>
      );
    } else {
      return null;
    }
  }

  return <div className="w-full">{children(data)}</div>;
}
