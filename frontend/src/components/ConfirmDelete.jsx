import { useEffect, useState } from "react";

export default function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
}) {
  const [loading, setLoading] = useState(false);

  // Escape key support
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (typeof onConfirm !== "function") return;

    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => onClose?.()}
    >
      <div
        className="bg-white p-6 rounded w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold mb-2">{title}</h2>
        <p className="mb-4 text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
