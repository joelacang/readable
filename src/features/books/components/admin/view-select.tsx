import { SelectContent } from "@radix-ui/react-select";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useBook } from "~/providers/book-provider";
import { AdminViewDetails } from "~/utils/get-values";

const BookAdminViewSelect = () => {
  const { view, setView } = useBook();
  return (
    <div className="bg-background sticky top-[0] z-50 w-full border-b xl:hidden">
      <div className="flex w-full items-center justify-end px-4 py-2">
        <Select value={view} onValueChange={setView}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent className="bg-sidebar m-4 w-56 p-2" side="bottom">
            {Object.entries(AdminViewDetails).map(([view, detail]) => (
              <SelectItem
                className="cursor-pointer space-x-4 px-2 py-2"
                value={view}
                key={view}
              >
                <detail.icon className="mr-2 h-4 w-4" />
                <p>{detail.label}</p>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BookAdminViewSelect;
