export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1 || typeof onChange !== "function") return null;

  const goToPrev = () => {
    if (page > 1) onChange(page - 1);
  };

  const goToNext = () => {
    if (page < totalPages) onChange(page + 1);
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={goToPrev}
        disabled={page === 1}
        className={`px-3 py-1 border rounded ${
          page === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      <span className="text-sm">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        onClick={goToNext}
        disabled={page === totalPages}
        className={`px-3 py-1 border rounded ${
          page === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
}
