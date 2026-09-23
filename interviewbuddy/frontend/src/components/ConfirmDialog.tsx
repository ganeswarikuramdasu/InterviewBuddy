import React from "react";
interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      {" "}
      <div className="card w-full max-w-sm p-6">
        {" "}
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>{" "}
        {description && (
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        )}{" "}
        <div className="mt-6 flex justify-end gap-2">
          {" "}
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>{" "}
          <button
            className={danger ? "btn-danger" : "btn-primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ConfirmDialog;
