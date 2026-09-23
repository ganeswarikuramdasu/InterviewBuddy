import React from "react";
const EmptyState: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, description, action, icon }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    {" "}
    {icon && <div className="mb-4 text-slate-300">{icon}</div>}{" "}
    <h3 className="text-base font-semibold text-slate-800">{title}</h3>{" "}
    {description && (
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
    )}{" "}
    {action && <div className="mt-4">{action}</div>}{" "}
  </div>
);
export default EmptyState;
