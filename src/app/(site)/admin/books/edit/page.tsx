"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import MessageBox from "~/components/message-box";
import EditBook from "~/features/books/components/admin/edit-book";
import Centered from "~/features/page/components/centered";
import { ConfirmationType } from "~/types/component";

const EditBookPage = () => {
  const searchParam = useSearchParams();
  const bookId = searchParam.get("id");

  if (!bookId) {
    return (
      <Centered>
        <MessageBox
          title="Missing Information"
          description="No BookId."
          mode={ConfirmationType.ERROR}
          icon={TriangleAlertIcon}
        />
      </Centered>
    );
  }

  return <EditBook bookId={bookId} />;
};

export default EditBookPage;
