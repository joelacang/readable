import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  iconColor?: string;
}
const SectionContainer = ({
  children,
  title,
  description,
  icon: Icon,
  className = "",
  iconColor = "bg-primary",
}: Props) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 py-3">
            <div className={cn("rounded-full p-2 text-white", iconColor)}>
              <Icon />
            </div>

            <h2 className="text-4xl leading-none font-bold">{title}</h2>
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
