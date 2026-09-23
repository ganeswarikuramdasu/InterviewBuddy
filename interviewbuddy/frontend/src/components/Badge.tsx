import React from "react";
const colorMap: Record<string, string> = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
  UPCOMING: "bg-brand-100 text-brand-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-600",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  WRONG_ANSWER: "bg-red-100 text-red-700",
  PENDING: "bg-amber-100 text-amber-700",
  COMPILE_ERROR: "bg-red-100 text-red-700",
  RUNTIME_ERROR: "bg-red-100 text-red-700",
  TIME_LIMIT_EXCEEDED: "bg-red-100 text-red-700",
};
const Badge: React.FC<{ label: string; variant?: string }> = ({
  label,
  variant,
}) => {
  const colorKey = variant ?? label;
  const classes = colorMap[colorKey] ?? "bg-slate-100 text-slate-600";
  return <span className={`badge ${classes}`}>{label.replace(/_/g, " ")}</span>;
};
export default Badge;
