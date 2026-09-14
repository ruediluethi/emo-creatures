export default function DebugAddOpponentCardButton({ onAdd }) {
  return (
    <button
      onClick={onAdd}
      className="rounded-lg border border-red-400/30 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-200/80 backdrop-blur-sm transition-colors hover:border-red-300/50 hover:text-red-100 active:scale-95"
    >
      Debug: Gegnerkarte +
    </button>
  );
}
