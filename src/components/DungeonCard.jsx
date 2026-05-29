import ClassIcon from "@/components/ClassIcon";
import DungeonIcon from "@/components/DungeonIcon";
import RoleBadge from "@/components/RoleBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Personajes que no han completado esta mazmorra
  const completedCharIds = new Set(rewards.map((r) => r.char));
  const incompleteChars = Object.values(charMap).filter(
    (c) => !completedCharIds.has(c.id) && c.charrole !== "Padre Ausente",
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-[#163544] rounded-lg p-3 shrink-0 min-w-72">
        <div className="flex items-center justify-between mb-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-2 cursor-default">
                <DungeonIcon name={dungeon.name} />
                <span className="font-semibold">{dungeon.name}</span>
                <span className="text-yellow-400 font-bold">{dungTotal}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-0.5">
                {incompleteChars.length > 0 ? (
                  <>
                    <p className="font-medium">Faltan por hacer:</p>
                    {incompleteChars.map((c) => (
                      <p key={c.id}>
                        {c.char} ({c.player})
                      </p>
                    ))}
                  </>
                ) : (
                  <p>Todos lo completaron</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate max-w-28 cursor-default">
                          {char ? char.char : `#${r.char}`}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{char?.player}</p>
                      </TooltipContent>
                    </Tooltip>
                    {char && <RoleBadge role={char.charrole} />}
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
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ),
                      )}
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
    </TooltipProvider>
  );
}
