import type React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  toolbarSection?: React.ReactNode;
}

const DashboardHeader = ({
  title,
  subtitle,
  toolbarSection,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between pb-8">
      <div className="flex flex-col">
        <h2 className="text-primary text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div>{toolbarSection}</div>
    </div>
  );
};

export default DashboardHeader;
