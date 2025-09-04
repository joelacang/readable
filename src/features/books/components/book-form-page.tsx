"use client";
import { useState } from "react";
import DashboardPage from "~/features/dashboard/components/dashboard-page";
import type { LinkDetailType } from "~/types/component";
import BookForm from "./book-form";
import AddBookConfirmation from "./add-book-confirmation";
import type { BookEditData } from "~/zod-schemas/book";
import type { BookPreviewType } from "~/types/book";

interface Props {
  mode: "blank" | "edit";
  book?: BookEditData;
}

const BookFormPage = ({ mode, book }: Props) => {
  const [formMode, setFormMode] = useState<"blank" | "edit" | "submitted">(
    mode,
  );
  const [submittedBook, setSubmittedBook] = useState<BookPreviewType | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [submittedImages, setSubmittedImages] = useState<LinkDetailType[]>([]);

  const handleSubmitForm = (data: BookPreviewType) => {
    setFormMode("submitted");
    setSubmittedBook(data);
  };

  const handleReset = (mode: "blank" | "edit") => {
    setFormMode(mode);
    setSubmittedBook(null);
    setSubmittedImages([]);
    setUploading(false);
  };

  const getSubtitle = () => {
    switch (formMode) {
      case "blank":
        return "Fill in the details to add a new book to your catalog";
      case "edit":
        return "Update the book information and save your changes";
      case "submitted":
        return mode === "edit"
          ? "Your book has been successfully updated"
          : "Your new book has been successfully added to the catalog";
      default:
        return "Manage your book details";
    }
  };

  const getTitle = () => {
    switch (formMode) {
      case "blank":
        return "Create New Book";
      case "edit":
        return "Edit Book";
      case "submitted":
        return mode === "edit" ? "Book Updated" : "Book Created";
      default:
        return "Manage Book";
    }
  };

  return (
    <DashboardPage title={getTitle()} subtitle={getSubtitle()}>
      {(formMode === "blank" || formMode === "edit") && !submittedBook && (
        <BookForm
          book={book}
          onSubmitForm={handleSubmitForm}
          onUploadingChange={setUploading}
          onGetSubmittedImages={setSubmittedImages}
        />
      )}
      {formMode === "submitted" && submittedBook && (
        <AddBookConfirmation
          book={submittedBook}
          uploading={uploading}
          savedImages={submittedImages}
          onReset={handleReset}
        />
      )}
    </DashboardPage>
  );
};

export default BookFormPage;
