import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearch } from "~/providers/search-provider";
import type { BookPreview } from "~/types/book";

interface Props {
  book: BookPreview;
}

const BookSearchResult = ({ book }: Props) => {
  const { onClear } = useSearch();
  const router = useRouter();

  return (
    <div
      className="hover:bg-almond-100 flex cursor-pointer flex-row items-center justify-start gap-2 p-2"
      onClick={() => {
        setTimeout(() => {
          onClear();
          router.push(`/books/${book.slug}`);
        }, 500);
      }}
    >
      {book.images[0] ? (
        <div className="relative aspect-square size-14">
          <Image
            fill
            src={book.images[0].url}
            alt={`${book.title} Book Cover`}
            className="object-contain"
          />
        </div>
      ) : (
        <div className="size-14">
          <ImageIcon size={24} />
        </div>
      )}

      <div>
        <p className="text-primary leading-none font-semibold">{book.title}</p>
        <div>
          {book.authors.map((a) => (
            <span className="font-mono text-sm leading-none" key={a.id}>
              {a.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSearchResult;
