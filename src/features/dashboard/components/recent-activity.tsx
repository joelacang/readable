import {
  AlertTriangleIcon,
  BellIcon,
  PackageIcon,
  RefreshCwIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import DashboardCard from "./dashboard-card";

const notifications = [
  {
    type: "order",
    message: "New order placed by John Doe",
    time: "2 minutes ago",
    icon: ShoppingCartIcon,
    color: "text-green-600",
  },
  {
    type: "inventory",
    message: "Stock for Wireless Headphones is low",
    time: "15 minutes ago",
    icon: AlertTriangleIcon,
    color: "text-amber-600",
  },
  {
    type: "refund",
    message: "Refund requested for order ORD-001",
    time: "1 hour ago",
    icon: RefreshCwIcon,
    color: "text-blue-600",
  },
  {
    type: "product",
    message: "New product 'Smart Watch' added",
    time: "2 hours ago",
    icon: PackageIcon,
    color: "text-purple-600",
  },
  {
    type: "customer",
    message: "New customer registration: Jane Smith",
    time: "3 hours ago",
    icon: UsersIcon,
    color: "text-cyan-600",
  },
];

const RecentActivity = () => {
  return (
    <DashboardCard
      title="Recent Activity"
      description="Real-time updates and system notifications"
      icon={BellIcon}
    >
      <div>
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <div
              key={index}
              className="hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors"
            >
              <Icon className={`mt-0.5 h-5 w-5 ${notification.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-pretty">
                  {notification.message}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {notification.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default RecentActivity;
