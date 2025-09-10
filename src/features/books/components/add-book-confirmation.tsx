import { BookIcon, CheckCircle2Icon, PencilIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import IndeterminateProgress from "~/components/indeterminate-progress";
import { Button, buttonVariants } from "~/components/ui/button";
import { useTempImages } from "~/features/storage/hooks/use-temp-images";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { BookPreview } from "~/types/book";
import type { LinkDetailType } from "~/types/component";

interface Props {
  book: BookPreview;
  uploading?: boolean;
  savedImages: LinkDetailType[];
  onReset: (mode: "blank" | "edit") => void;
}

const AddBookConfirmation = ({
  book,
  uploading = false,
  savedImages,
  onReset,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookIdParams = searchParams.get("id");
  const utils = api.useUtils();
  const { images, onClear } = useTempImages();

  const handleEditBook = async () => {
    if (pathname.startsWith(`/admin/books/edit`) && bookIdParams === book.id) {
      await utils.book.getBookDataById.reset({ bookId: book.id });
    } else {
      router.push(`/admin/books/edit?id=${book.id}`);
    }
  };

  useEffect(() => {
    console.log("Component mounted, images before clear:", images);
    onClear();
    console.log("onClear called");

    // Check if it actually cleared
    setTimeout(() => {
      const { images: afterClear } = useTempImages.getState();
      console.log("Images after clear:", afterClear);
    }, 0);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-md border px-4 py-8 shadow-md">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <CheckCircle2Icon className="!size-12 text-green-500" />
        <h2 className="text-xl font-semibold text-green-500">
          Book added successfully!
        </h2>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        <p className="text-left text-gray-600">
          Here&apos;s the book you just added:
        </p>

        {/* Book Preview Section */}
        <div className="flex w-full flex-col items-center gap-4 rounded-md border bg-gray-50 p-4 md:flex-row md:items-start">
          {/* Book Cover */}
          {savedImages.length > 0 && (
            <div className="relative aspect-square w-32 bg-transparent">
              <Image
                fill
                className="object-contain"
                src={savedImages[0]?.slug ?? ""}
                alt="Book cover Image"
              />
            </div>
          )}

          {/* Book Info */}
          <div className="flex w-full flex-1 flex-col gap-2">
            <h3 className="text-lg font-bold">{book?.title}</h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Author:&nbsp;</span>
              {book?.authors.map((a) => (
                <span key={a.id}>{a.name}</span>
              ))}
            </p>
            <p className="text-sm text-gray-600">{book.description}</p>

            {/* Additional Info */}
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Book ID:</span>{" "}
                <span>{book.id}</span>
              </p>
              <p>
                <span className="font-semibold">Categories:</span>
                {book.categories.map((c, index) => (
                  <span key={c.id}>
                    <Link
                      className={cn(
                        buttonVariants({ variant: "link", size: "sm" }),
                        "size-fit",
                      )}
                      href={`/admin/books?categoryId=${c.id}`}
                    >
                      {c.name}
                    </Link>
                    {index + 1 < book.categories.length && ","}
                  </span>
                ))}
              </p>
              <div className="space-y-1">
                <p className="font-semibold">Price:</p>
                <div className="pl-4">
                  {book.variants.map((v) => (
                    <p key={v.id}>{`${v.format} - $${v.price} `}</p>
                  ))}
                </div>
              </div>
            </div>
            {uploading ? (
              <div className="text-primary flex w-full flex-col items-center justify-center gap-2">
                <p className="text-xs">Uploading Images...</p>
                <IndeterminateProgress />
              </div>
            ) : null}
            {!uploading ? (
              <div className="mt-4">
                <Button variant="secondary" onClick={handleEditBook}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit Book
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!uploading ? (
        <div className="mt-6 flex gap-4">
          <Button
            variant="default"
            onClick={() => {
              onReset("blank");
              router.push("/admin/books/new");
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
          <Button
            variant="outline"
            onClick={() => router.replace(`/admin/books/${book.slug}`)}
          >
            <BookIcon className="mr-2 h-4 w-4" />
            Go to Book Details
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default AddBookConfirmation;
