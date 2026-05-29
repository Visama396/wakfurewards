// Barra de filtros por jugador para la sección de pendientes
export default function FilterBar({
  players,
  currentFilter,
  onFilter,
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => onFilter(null)}
        className={`text-xs px-2 py-0.5 rounded ${!currentFilter ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"}`}
      >
        Todos
      </button>
      {players.map((p) => (
        <button
          key={p}
          onClick={() => onFilter(p)}
          className={`text-xs px-2 py-0.5 rounded ${currentFilter === p ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
