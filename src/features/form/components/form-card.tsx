import type { HTMLProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface FormCardProps extends HTMLProps<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  settings?: React.ReactNode;
}
const FormCard = ({
  title,
  description,
  children,
  className,
  settings,
  ...props
}: FormCardProps) => {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {settings}
      </CardHeader>
      <CardContent className="@container space-y-5">{children}</CardContent>
    </Card>
  );
};

export default FormCard;
