import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useCategoryDialog } from "../hooks/use-category-dialog";
import CategoryForm from "./category-form";
import type React from "react";

const CategoryDialog = () => {
  const { open, onClose, currentCategory, parentCategory } =
    useCategoryDialog();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {`${currentCategory ? "Edit" : "Add New"} ${parentCategory ? "Sub-Category" : "Category"}`}
          </DialogTitle>
          <DialogDescription>
            Create a new category to organize your e-books. Categories help
            users discover books by genre, topic, or theme.
          </DialogDescription>

          <CategoryForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
