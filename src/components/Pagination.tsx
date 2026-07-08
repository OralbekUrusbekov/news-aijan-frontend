'use client';

interface Props {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onChange: (page: number) => void;
}

export default function Pagination({ page, hasNext, hasPrevious, onChange }: Props) {
  if (!hasNext && !hasPrevious) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <button
        disabled={!hasPrevious}
        onClick={() => onChange(page - 1)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        ← Previous
      </button>
      <span className="text-sm text-gray-600">{page}</span>
      <button
        disabled={!hasNext}
        onClick={() => onChange(page + 1)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next →
      </button>
    </div>
  );
}
