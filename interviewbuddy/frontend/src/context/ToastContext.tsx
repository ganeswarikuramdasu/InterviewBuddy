import React, { createContext, useCallback, useContext, useState } from "react";
type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}
const ToastContext = createContext<ToastContextValue | undefined>(undefined);
let idCounter = 0;
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {" "}
      {children}{" "}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {" "}
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white animate-[fadeIn_0.2s_ease-out] ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-slate-800"}`}
          >
            {" "}
            {t.message}{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </ToastContext.Provider>
  );
};
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
