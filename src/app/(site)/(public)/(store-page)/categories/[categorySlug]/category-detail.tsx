"use client";

import { Loader2Icon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import MessageBox from "~/components/message-box";
import BookLimitSelect from "~/features/books/components/book-limit-select";
import BookList from "~/features/books/components/book-list";
import PageHeader from "~/features/page/components/page-header";
import { api } from "~/trpc/react";
import { ModeType } from "~/types/component";

interface Props {
  slug: string | null;
}
const CategoryDetail = ({ slug }: Props) => {
  const {
    data: category,
    isLoading,
    isError,
    error,
  } = api.category.getCategoryBySlug.useQuery(
    { slug: slug ?? "" },
    {
      enabled: !!slug,
    },
  );

  if (isLoading) {
    return (
      <div className="text-primary flex w-full flex-col items-center justify-center gap-2 px-4 py-8">
        <Loader2Icon className="animate-spin" />
        <p className="font-semibold">Loading Category...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <MessageBox
        title="Error Loading Category"
        icon={TriangleAlertIcon}
        mode={ModeType.ERROR}
        description={error.message}
      />
    );
  }

  if (!category) {
    return (
      <MessageBox
        title="Category Not Found"
        icon={SearchXIcon}
        mode={ModeType.DEFAULT}
        description="The category you are looking for does not exist."
      />
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        title={category.name}
        description={
          category.description ?? `Browse books from ${category.name} here.`
        }
      />

      {/* FILTER DESCRIPTION */}
      <div className="py-4">
        <BookLimitSelect />
        <BookList catIdProp={category.id} />
      </div>
    </div>
  );
};

export default CategoryDetail;
