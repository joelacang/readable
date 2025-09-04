"use client";

import { BookPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const AddBookButton = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push(`/admin/books/new`)}>
      <BookPlusIcon />
      Add Book
    </Button>
  );
};

export default AddBookButton;
