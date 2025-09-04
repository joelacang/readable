import { Divide, PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DetailInfo from "~/components/detail-info";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import AuthorButton from "~/features/authors/components/author-button";
import DetailContainer from "~/features/page/components/detail-container";
import { useBook } from "~/providers/book-provider";
import BookVariantCard from "../book-variant-card";

const BookDetails = () => {
  const { book } = useBook();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
          <CardDescription>
            Basic book details and specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailContainer columns={2}>
            <DetailInfo title="Title" description={book.title} />
            <DetailInfo title="Subtitle" description={book.subtitle} />
          </DetailContainer>

          <DetailInfo
            title="Author"
            description={
              <div className="text-primary flex flex-wrap gap-3 text-sm">
                {book.authors.map((author) => (
                  <AuthorButton key={author.id} author={author} />
                ))}
              </div>
            }
          />

          <DetailInfo title="Description" description={book.description} />

          <DetailInfo
            title="Tags"
            description={
              <div className="flex space-x-2">
                {book.tags.map((t) => (
                  <Badge key={t.id}>#{t.name}</Badge>
                ))}
              </div>
            }
          />

          <DetailContainer columns={2}>
            <DetailInfo
              title="Categories"
              description={
                <div className="space-x-2">
                  {book.categories.map((c) => (
                    <span className="text-primary text-sm" key={c.id}>
                      {c.name}
                    </span>
                  ))}
                </div>
              }
            />
            <DetailInfo
              title="Series"
              description={
                <div>
                  {book.series.map((s) => (
                    <span className="text-primary text-sm" key={s.id}>
                      {s.name}
                    </span>
                  ))}
                </div>
              }
            />
          </DetailContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Book Information</CardTitle>
          <CardDescription>
            Additional information about the book
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailContainer columns={3}>
            <DetailInfo title="Publisher" description={book.publisher} />
            <DetailInfo
              title="Published Date"
              description={book.publishedDate?.toDateString()}
            />
            <DetailInfo title="ISBN" description={book.isbn} />
          </DetailContainer>
          <DetailContainer columns={3}>
            <DetailInfo title="Page Count" description={book.pageCount} />
            <DetailInfo title="Word Count" description={book.wordCount} />
            <DetailInfo
              title="Reading Time"
              description={`${book.pageCount} min`}
            />
          </DetailContainer>
          <DetailContainer columns={3}>
            <div className="col-span-1">
              <DetailInfo title="Age Rating" description={book.ageRating} />
            </div>

            <div className="col-span-2">
              <DetailInfo
                title="Content Warning"
                description={
                  <div className="flex flex-wrap gap-2">
                    {book.contentWarnings.map((label) => (
                      <Badge key={label} className="bg-destructive">
                        {label}
                      </Badge>
                    ))}
                  </div>
                }
              />
            </div>
          </DetailContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book Variants</CardTitle>
          <CardDescription>
            Book formats and pricing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {book.variants.map((variant) => (
              <BookVariantCard key={variant.id} variant={variant} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book Images</CardTitle>
          <CardDescription>Manage book photos and media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {book.images.map((image, index) => (
              <div key={image.id} className="relative aspect-square w-full">
                <Image
                  fill
                  src={image.url}
                  alt={`${book.title} Image ${index}`}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetails;
