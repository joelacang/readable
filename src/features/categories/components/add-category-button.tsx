"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCategoryDialog } from "../hooks/use-category-dialog";

const AddCategoryButton = () => {
  const { onOpen } = useCategoryDialog();
  return (
    <Button onClick={onOpen}>
      <PlusIcon />
      Add Category
    </Button>
  );
};

export default AddCategoryButton;
