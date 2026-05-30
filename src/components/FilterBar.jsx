export default function FilterBar({ players = [], currentFilter, onFilter }) {
  return (
    <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 px-1 horizontal-scroll w-full">
      <button
        onClick={() => onFilter(null)}
        className={`px-2.5 py-1 text-xs rounded transition-all border ${
          currentFilter === null
            ? "bg-orange-400 text-black border-transparent scale-105 shadow-md font-semibold"
            : "bg-orange-950/40 text-orange-300 border-orange-800/30 hover:bg-orange-900/30"
        }`}
      >
        Todos
      </button>

      {players.map((player) => {
        const isActive = currentFilter === player;

        return (
          <button
            key={player}
            onClick={() => onFilter(player)}
            className={`px-2.5 py-1 text-xs rounded border transition-all ${
              isActive
                ? "bg-orange-400 text-black border-transparent scale-105 shadow-md font-semibold"
                : "bg-orange-950/40 text-orange-300 border-orange-800/30 hover:bg-orange-900/30"
            }`}
          >
            {player}
          </button>
        );
      })}
    </div>
  );
}
