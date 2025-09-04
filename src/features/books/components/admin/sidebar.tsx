import { Button } from "~/components/ui/button";
import { useBook } from "~/providers/book-provider";
import type { AdminView } from "~/types/book";
import { AdminViewDetails } from "~/utils/get-values";

const BookAdminSidebar = () => {
  const { view: currentAdminView, setView } = useBook();

  return (
    <aside className="w-64 overflow-y-auto p-6">
      <nav className="space-y-2">
        {Object.entries(AdminViewDetails).map(([view, detail]) => {
          const viewKey = view as AdminView;

          return (
            <Button
              key={viewKey}
              variant={currentAdminView === viewKey ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setView(viewKey)}
            >
              <detail.icon className="mr-2 h-4 w-4" />
              {detail.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default BookAdminSidebar;
