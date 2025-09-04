"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useBookPagination } from "../hooks/use-book-pagination";
import { Button } from "~/components/ui/button";
import { useCategorySheet } from "~/features/categories/hooks/use-category-sheet";

const BookLimitSelect = () => {
  const {
    limit,
    onSetLimit,
    onLoadFirstPage,
    isLoadingFirstPage,
    isLoadingMore,
  } = useBookPagination();
  const { onOpen } = useCategorySheet();

  const isPending = isLoadingFirstPage || isLoadingMore;
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4 xl:justify-end">
      <div className="block xl:hidden">
        <Button onClick={() => onOpen()}>Show Categories</Button>
      </div>
      <div className="flex flex-row items-center gap-4">
        <p className="text-sm">Books Per Page:</p>
        <Select
          defaultValue={limit.toString()}
          onValueChange={(value) => {
            onSetLimit(Number(value));
            onLoadFirstPage();
          }}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder={limit.toString()} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50].map((option) => (
              <SelectItem
                className="cursor-pointer"
                key={option}
                value={option.toString()}
              >
                {option.toString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BookLimitSelect;
