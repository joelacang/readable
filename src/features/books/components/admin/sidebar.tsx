import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useBook } from "~/providers/book-provider";
import type { AdminView } from "~/types/book";
import { AdminViewDetails } from "~/utils/get-values";

const BookAdminSidebar = () => {
  const { book } = useBook();
  const router = useRouter();
  const { viewParam } = useParams();
  const rawView = viewParam?.[0];

  return (
    <aside className="w-64 overflow-y-auto p-6">
      <nav className="space-y-2">
        {Object.entries(AdminViewDetails).map(([view, detail]) => (
          <Button
            key={view}
            variant={rawView === view ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => router.push(`/admin/books/${book.slug}/${view}`)}
          >
            <detail.icon className="mr-2 h-4 w-4" />
            {detail.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default BookAdminSidebar;
