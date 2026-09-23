import React from "react";
import Spinner from "./Spinner";
const LoadingState: React.FC<{ label?: string }> = ({
  label = "Loading...",
}) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
    {" "}
    <Spinner size="lg" /> <p className="text-sm">{label}</p>{" "}
  </div>
);
export default LoadingState;
