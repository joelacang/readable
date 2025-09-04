import { CopyIcon, EditIcon, ImageIcon, Trash2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import BookAdminDropdownMenu from "./dropdown-menu";
import { useIsMobile } from "~/hooks/use-mobile";
import { useBook } from "~/providers/book-provider";
import AuthorButton from "~/features/authors/components/author-button";
import { useRouter } from "next/navigation";

const BookAdminHeader = () => {
  const isMobile = useIsMobile();
  const { book } = useBook();
  const router = useRouter();
  return (
    <header className="border-border bg-card sticky top-[57px] z-50 border-b p-2 xl:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {book.images[0]?.url ? (
            <div className="relative aspect-square w-12">
              <Image
                fill
                className="object-contain"
                src={book.images[0].url}
                alt={`${book.title} Book Cover`}
              />
            </div>
          ) : (
            <div className="bg-muted size-12 rounded-lg">
              <ImageIcon className="text-muted-foreground size-6" />
            </div>
          )}
          <div>
            <h1 className="text-foreground line-clamp-1 text-xl leading-none font-bold">
              {book.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {book.authors.map((a, index) => (
                <AuthorButton key={a.id} author={a} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive border-destructive hover:bg-red-50"
            size="sm"
            onClick={() => router.push(`/admin/books`)}
          >
            <>
              <XIcon className="h-4 w-4" />
              {!isMobile ? "Exit Book" : null}
            </>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default BookAdminHeader;
