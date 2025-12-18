import {
  BarChart3Icon,
  PackageIcon,
  PercentIcon,
  PlusIcon,
  ShoppingCartIcon,
  SquarePlusIcon,
  UsersIcon,
} from "lucide-react";
import DashboardCard from "./dashboard-card";
import { Button } from "~/components/ui/button";

const quickActions = [
  {
    title: "Add New Product",
    description: "Create a new product listing",
    icon: PlusIcon,
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  {
    title: "Create Discount",
    description: "Set up promotional offers",
    icon: PercentIcon,
    color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
  {
    title: "Manage Orders",
    description: "View and process orders",
    icon: ShoppingCartIcon,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  {
    title: "View Reports",
    description: "Access detailed analytics",
    icon: BarChart3Icon,
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  {
    title: "Inventory Management",
    description: "Update stock levels",
    icon: PackageIcon,
    color: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  },
  {
    title: "Customer Support",
    description: "Handle customer inquiries",
    icon: UsersIcon,
    color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  },
];

const QuickActions = () => {
  return (
    <DashboardCard
      title="Quick Actions"
      description="Shortcuts to common tasks"
      icon={SquarePlusIcon}
    >
      <div className="grid grid-cols-1 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="hover:bg-muted/50 h-auto justify-start p-4"
            >
              <div className="flex w-full items-center gap-3">
                <div className={`rounded-lg p-2 ${action.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-balance">
                    {action.title}
                  </p>
                  <p className="text-muted-foreground text-xs text-pretty">
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default QuickActions;
