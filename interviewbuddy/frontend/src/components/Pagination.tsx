import React from "react";
const Pagination: React.FC<{
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {" "}
      <button
        className="btn-secondary"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>{" "}
      <span className="text-sm text-slate-500 px-2">
        Page {page + 1} of {totalPages}
      </span>{" "}
      <button
        className="btn-secondary"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>{" "}
    </div>
  );
};
export default Pagination;
