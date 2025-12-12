export default function ResetSlot({ onReset, error }: { onReset: () => void; error: string | null }) {
  return (
    <div className="px-2 pt-2">
      <div className="w-[72px]">
        {error ? (
          <div className="text-[11px] leading-snug text-red-700 bg-red-100 border border-red-200 rounded px-2 py-1">
            {error}
          </div>
        ) : (
          <button className="border rounded px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm" onClick={onReset}>
            reset
          </button>
        )}
      </div>
    </div>
  );
}
