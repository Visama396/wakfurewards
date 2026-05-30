import { useState } from "react";
import ClassIcon from "@/components/ClassIcon";
import DungeonIcon from "@/components/DungeonIcon";
import RoleBadge from "@/components/RoleBadge";
import TooltipCell from "@/components/TooltipCell";
import TrashIcon from "@/components/TrashIcon";
import PlusIcon from "@/components/PlusIcon";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { TooltipProvider } from "@/components/ui/tooltip";

// Tarjeta de mazmorra completada con lista de personajes y sus stasis
export default function DungeonCard({
  dungeon,
  rewards,
  charMap,
  onAdd,
  onDelete,
  onUpdateStasis,
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedStasis, setSelectedStasis] = useState(1);

  // Suma total de stasis de todas las recompensas de esta mazmorra
  const dungTotal = rewards.reduce((s, r) => s + r.stasis, 0);

  // Personajes que no han completado esta mazmorra (excluyendo Padre Ausente)
  const completedCharIds = new Set(rewards.map((r) => r.char));
  const incompleteChars = Object.values(charMap).filter(
    (c) => !completedCharIds.has(c.id) && c.charrole !== "Padre Ausente",
  );

  function handleSubmit() {
    if (!selectedChar) return;
    onAdd(dungeon.id, selectedChar.id, selectedStasis);
    setPopoverOpen(false);
    setSelectedChar(null);
    setSelectedStasis(1);
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-[#163544] rounded-lg p-3 shrink-0 min-w-72 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <TooltipCell
            content={
              <div className="text-xs space-y-0.5">
                {incompleteChars.length > 0 ? (
                  <>
                    <p className="font-medium">Faltan por hacer:</p>
                    {incompleteChars.map((c) => (
                      <p key={c.id}>{c.char}</p>
                    ))}
                  </>
                ) : (
                  <p>Todos lo completaron</p>
                )}
              </div>
            }
          >
            <span className="flex items-center gap-2 cursor-default">
              <DungeonIcon name={dungeon.name} />
              <span className="font-semibold">{dungeon.name}</span>
              <span className="text-yellow-500 font-bold">{dungTotal}</span>
            </span>
          </TooltipCell>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className="text-xs bg-orange-400 hover:bg-orange-300 rounded px-2 py-1 cursor-pointer text-black"
              >
                <PlusIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <p className="text-sm font-medium mb-1">Añadir personaje</p>
              <Combobox
                items={incompleteChars}
                value={selectedChar}
                onValueChange={(item) => setSelectedChar(item)}
                itemToStringLabel={(item) =>
                  `${item.char} — ${item.class} (${item.charrole})`
                }
                itemToStringValue={(item) => item.id.toString()}
              >
                <ComboboxInput placeholder="Buscar personaje..." />
                <ComboboxContent>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.char} — {item.class} ({item.charrole})
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                  <ComboboxEmpty>Sin personajes disponibles</ComboboxEmpty>
                </ComboboxContent>
              </Combobox>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-xs text-gray-400">Stasis:</label>
                <select
                  value={selectedStasis}
                  onChange={(e) => setSelectedStasis(parseInt(e.target.value))}
                  className="flex-1 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-1"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedChar}
                  className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded px-3 py-1.5 cursor-pointer font-medium"
                >
                  Añadir
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto vertical-scroll min-h-0 pr-1.5">
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
                    <TooltipCell
                      content={<p className="text-xs">{char?.player}</p>}
                    >
                      <span className="truncate max-w-28 cursor-default">
                        {char ? char.char : `#${r.char}`}
                      </span>
                    </TooltipCell>
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
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                    >
                      <TrashIcon />
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
