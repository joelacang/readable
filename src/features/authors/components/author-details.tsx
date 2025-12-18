import DetailInfo from "~/components/detail-info";
import { QueryStateHandler } from "~/components/query-state-handler";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";

interface Props {
  authorId: string;
}
const AuthorDetails = ({ authorId }: Props) => {
  const {
    data: author,
    isLoading,
    isError,
    error,
  } = api.author.getAuthorDetailsById.useQuery({ authorId });
  return (
    <QueryStateHandler
      data={author}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
      loadingLabel="Loading Author..."
      emptyDescription="No Author Found. Please try again."
      emptyTitle="Author not Found"
      errorTitle="Error Loading Author"
    >
      {(author) => (
        <div className="flex w-full flex-col items-center justify-start">
          <Avatar className="size-24">
            <AvatarImage
              src={author.imageUrl ?? "/images/avatar-placeholder.jpg"}
            />
          </Avatar>
          <div className="w-full space-y-3 py-8">
            <DetailInfo title="Name" description={author.name} />
            <DetailInfo title="Biography" description={author.biography} />
            <div className="grid grid-cols-2">
              <DetailInfo
                title="Birthdate"
                description={
                  author.birthDate?.toLocaleDateString() ?? "No Information"
                }
              />
              <DetailInfo
                title="Nationality"
                description={author.nationality ?? "No Information"}
              />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                Social Media
              </p>
              <p>Include Social Media accounts here.</p>
            </div>
          </div>
        </div>
      )}
    </QueryStateHandler>
  );
};

export default AuthorDetails;
