import { Button } from "~/components/ui/button";
import type { LinkDetailType } from "~/types/component";
import { useAuthorDetail } from "../hooks/use-author-detail";

interface Props {
  author: LinkDetailType;
}
const AuthorButton = ({ author }: Props) => {
  const { onOpen } = useAuthorDetail();
  return (
    <Button
      className="size-fit p-0"
      variant="link"
      key={author.id}
      size="sm"
      onClick={() => onOpen(author.id)}
    >
      {author.name}
    </Button>
  );
};

export default AuthorButton;
