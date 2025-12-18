import { Button } from "~/components/ui/button";
import type { LinkDetailType } from "~/types/component";
import { useAuthorDetail } from "../hooks/use-author-detail";
import { cn } from "~/lib/utils";

interface Props {
  author: LinkDetailType;
  size?: "sm" | "md" | "lg";
}
const AuthorButton = ({ author, size = "md" }: Props) => {
  const { onOpen } = useAuthorDetail();
  return (
    <Button
      className="size-fit p-0"
      variant="link"
      key={author.id}
      size="sm"
      onClick={() => onOpen(author.id)}
    >
      <p
        className={cn(
          size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg",
        )}
      >
        {author.name}
      </p>
    </Button>
  );
};

export default AuthorButton;
