import type { LucideIcon } from "lucide-react";
import type { HTMLProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Props extends HTMLProps<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  settings?: React.ReactNode;
}
const DashboardCard = ({
  title,
  description,
  icon: Icon,
  footer,
  children,
  className,
  settings,
  ...props
}: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center justify-start gap-3">
          {Icon && <Icon className="h-4 w-4" />}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {settings}
      </CardHeader>
      <CardContent className={className} {...props}>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;
