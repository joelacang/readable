import { DollarSign, XIcon, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Props {
  title: string;
  icon?: LucideIcon;
  content: string;
  subtitle?: string | React.ReactNode;
}
const DashboardCard = ({ title, icon, content, subtitle }: Props) => {
  const Icon = icon ?? XIcon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
        {subtitle ? (
          <>
            {typeof subtitle === "string" ? (
              <p className="text-muted-foreground text-xs">{subtitle}</p>
            ) : (
              <div>{subtitle}</div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
