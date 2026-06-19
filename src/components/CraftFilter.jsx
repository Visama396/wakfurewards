export default function CraftFilter({ jobs = [], currentFilter, onFilter }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onFilter("")}
        className={`px-2 py-1 text-xs rounded border ${currentFilter === "" ? "bg-orange-500 text-black" : "bg-gray-800 text-white"}`}
      >
        Todos
      </button>
      {jobs.map((j) => (
        <button
          key={j}
          onClick={() => onFilter(j)}
          className={`px-2 py-1 text-xs rounded border ${currentFilter === j ? "bg-orange-500 text-black" : "bg-gray-800 text-white"}`}
        >
          {j}
        </button>
      ))}
    </div>
  );
}
