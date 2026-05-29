import ClassIcon from "./ClassIcon";
import DungeonIcon from "./DungeonIcon";

// Tarjeta de mazmorra completada con lista de personajes y sus stasis
export default function DungeonCard({
  dungeon,
  rewards,
  charMap,
  onAdd,
  onDelete,
  onUpdateStasis,
}) {
  const dungTotal = rewards.reduce((s, r) => s + r.stasis, 0);

  return (
    <div className="bg-[#163544] rounded-lg p-3 shrink-0 min-w-72">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <DungeonIcon name={dungeon.name} />
          <span className="font-semibold">{dungeon.name}</span>
          <span className="text-yellow-400 font-bold">{dungTotal}</span>
        </div>
        <button
          onClick={() => onAdd(dungeon.id)}
          className="text-xs bg-blue-600 hover:bg-blue-500 rounded px-2 py-1"
        >
          +Añadir
        </button>
      </div>
      <div className="space-y-1">
        {[...rewards]
          .sort((a, b) => {
            const diff = b.stasis - a.stasis;
            if (diff !== 0) return diff;
            const ca = charMap[a.char];
            const cb = charMap[b.char];
            return (ca?.char || "").localeCompare(cb?.char || "");
          })
          .map((r) => {
            const char = charMap[r.char];
            return (
              <div
                key={r.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-1">
                  {char && (
                    <ClassIcon cls={char.class} gender={char.gender} />
                  )}
                  {char ? char.char : `#${r.char}`}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    defaultValue={r.stasis}
                    onBlur={(e) => {
                      const v = parseInt(e.target.value);
                      if (v !== r.stasis) onUpdateStasis(r.id, v);
                    }}
                    className="w-12 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-0.5"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
