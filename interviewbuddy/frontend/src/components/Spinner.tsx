import React from "react";
const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const sizeClass =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return (
    <div
      className={`inline-block ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {" "}
      <div
        className={`${sizeClass} animate-spin rounded-full border-2 border-slate-200 border-t-brand-600`}
      />{" "}
    </div>
  );
};
export default Spinner;
