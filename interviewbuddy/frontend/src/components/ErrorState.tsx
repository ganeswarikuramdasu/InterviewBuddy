import React from "react";
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    {" "}
    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl mb-3">
      !
    </div>{" "}
    <p className="text-sm text-slate-600 max-w-sm">{message}</p>{" "}
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mt-4">
        Try again
      </button>
    )}{" "}
  </div>
);
export default ErrorState;
