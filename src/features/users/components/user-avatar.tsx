import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { Size } from "~/types/component";
import type { UserType } from "~/types/users";
import { getSize } from "~/utils/get-values";

interface Props {
  user: UserType;
  size?: Size;
}
const UserAvatar = ({ user, size = Size.MEDiUM }: Props) => {
  const dimension = getSize(size);
  return (
    <Avatar
      style={{ height: dimension, width: dimension }}
      className={cn("cursor-pointer", size === Size.XSMALL && "size-6")}
    >
      {user.image && <AvatarImage src={user.image} />}
      <AvatarFallback className="text- font-poppins text-lg font-bold">
        {/* MAKE FONT SIZE */}
        {user.username?.charAt(0).toUpperCase() ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
