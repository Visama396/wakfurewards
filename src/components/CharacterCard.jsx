import { useState } from "react";
import ClassIcon from "@/components/ClassIcon";
import RoleBadge from "@/components/RoleBadge";
import TooltipCell from "@/components/TooltipCell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EyeOff } from "lucide-react";
import { STASIS_OPTIONS } from "@/lib/constants";
import { useIsFinePointer } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function CharacterCard({
  character,
  onAddReward,
  onOpenBuilder,
  dungeons = [],
  rewardMap = {},
  onTogglePadre,
}) {
  const completedDungs = new Set(
    (rewardMap[character.id] || []).map((r) => r.dung),
  );
  const uncompletedDungeons = dungeons.filter((d) => !completedDungs.has(d.id));
  const canDrag = useIsFinePointer();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDung, setSelectedDung] = useState(null);
  const [selectedStasis, setSelectedStasis] = useState(1);

  function handleSubmit() {
    if (!selectedDung) return;
    onAddReward(selectedDung.id, character.id, selectedStasis);
    setPopoverOpen(false);
    setSelectedDung(null);
    setSelectedStasis(1);
  }

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", character.id.toString());
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        draggable={canDrag}
        onDragStart={canDrag ? handleDragStart : undefined}
        className={`bg-[#163544] rounded px-3 py-2 flex items-center justify-between gap-2 group/card ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <TooltipCell
              side="right"
              content={
                <div className="text-xs space-y-0.5">
                  {uncompletedDungeons.length > 0 ? (
                    <>
                      <p className="font-medium text-orange-300">
                        Mazmorras pendientes ({uncompletedDungeons.length}):
                      </p>
                      {uncompletedDungeons.map((d) => (
                        <p key={d.id}>{d.name}</p>
                      ))}
                    </>
                  ) : (
                    <p className="text-green-400">¡Todo completado este mes!</p>
                  )}
                </div>
              }
            >
              <div className="font-medium truncate flex items-center gap-1 cursor-default select-none w-fit max-w-full hover:text-orange-200 transition-colors">
                <ClassIcon cls={character.class} gender={character.gender} />
                {character.char}
              </div>
            </TooltipCell>
            <button
              onClick={() => onTogglePadre(character)}
              className="opacity-0 group-hover/card:opacity-40 hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-0.5 rounded cursor-pointer"
              title="Ocultar personaje (Enviar a Padre Ausente)"
            >
              <EyeOff size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <span>{character.class}</span>
            <RoleBadge role={character.charrole} />
          </div>
        </div>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="shrink-0 text-xs bg-orange-400 hover:bg-orange-300 rounded px-2 py-1 cursor-pointer text-black">
              +Añadir
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-64 bg-[#0d2733] border border-gray-600 text-white"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Añadir personaje</p>
              {selectedDung && (
                <button
                  onClick={() => { onOpenBuilder(selectedDung.id, character); setPopoverOpen(false); }}
                  className="text-xs bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 cursor-pointer font-medium text-white whitespace-nowrap"
                >
                  Al Builder
                </button>
              )}
            </div>
            <Combobox
              items={uncompletedDungeons}
              value={selectedDung}
              onValueChange={(item) => setSelectedDung(item)}
              itemToStringLabel={(item) => (item ? item.name : "")}
              itemToStringValue={(item) => (item && item.id ? item.id.toString() : "")}
            >
              <ComboboxInput placeholder="Buscar mazmorra..." />
              <ComboboxContent className="bg-[#163544] border border-gray-600 text-white">
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
                <ComboboxEmpty>Sin mazmorras disponibles</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
            <div className="flex items-center gap-2 mt-2">
              <label className="text-xs text-gray-400">Stasis:</label>
              <select
                value={selectedStasis}
                onChange={(e) => setSelectedStasis(parseInt(e.target.value))}
                className="flex-1 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-1"
              >
                {STASIS_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSubmit}
                disabled={!selectedDung}
                className="text-xs bg-orange-400 hover:bg-orange-300 disabled:opacity-40 rounded px-3 py-1.5 cursor-pointer font-medium text-black"
              >
                Añadir
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}
