import React from "react";
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {" "}
      <div
        className={`card w-full ${wide ? "max-w-2xl" : "max-w-md"} my-8 p-6`}
      >
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>{" "}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>{" "}
        </div>{" "}
        {children}{" "}
      </div>{" "}
    </div>
  );
};
export default Modal;
