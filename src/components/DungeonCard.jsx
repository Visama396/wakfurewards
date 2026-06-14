import { useState } from "react";
import ClassIcon from "@/components/ClassIcon";
import DungeonIcon from "@/components/DungeonIcon";
import RoleBadge from "@/components/RoleBadge";
import TooltipCell from "@/components/TooltipCell";
import TrashIcon from "@/components/TrashIcon";
import PlusIcon from "@/components/PlusIcon";
import { STASIS_OPTIONS } from "@/lib/constants";
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
import { recommendTeam } from "@/lib/teamRecommender";
import { getGuide } from "@/data/dungeonGuides";
import { useIsFinePointer } from "@/lib/utils";
import TeamRecommendationModal from "@/components/TeamRecommendationModal";
import DungeonGuideModal from "@/components/DungeonGuideModal";

export default function DungeonCard({
  dungeon,
  rewards,
  charMap,
  onAdd,
  onDelete,
  onUpdateStasis,
  onAddTeam,
  highlightedDungeonNames = new Set(),
  moduloxDungeonNames = new Set(),
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedStasis, setSelectedStasis] = useState(1);
  const [showRecommender, setShowRecommender] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [rerolearExcludedIds, setRerolearExcludedIds] = useState(new Set());
  const [presetChar, setPresetChar] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const canDrag = useIsFinePointer();
  const [dragOver, setDragOver] = useState(false);

  const dungTotal = rewards.reduce((s, r) => s + r.stasis, 0);

  const isDaily = highlightedDungeonNames.has(dungeon.name);
  const isModulox = moduloxDungeonNames.has(dungeon.name);
  const variantClass =
    isDaily && isModulox
      ? "bg-gradient-to-br from-yellow-500/15 to-sky-500/15 ring-1 ring-inset ring-purple-400/40"
      : isDaily
        ? "bg-yellow-500/10 ring-1 ring-inset ring-yellow-500/40"
        : isModulox
          ? "bg-sky-500/10 ring-1 ring-inset ring-sky-500/40"
          : "bg-[#163544]";

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

  function handleRecommend(char) {
    setPresetChar(char || null);
    const result = recommendTeam(dungeon.name, incompleteChars);
    setRecommendationResult(result);
    setRerolearExcludedIds(new Set());
    setShowRecommender(true);
  }

  function handleRerolear(teamCharIds) {
    const newExcluded = new Set(rerolearExcludedIds);
    teamCharIds.forEach((id) => newExcluded.add(id));
    setRerolearExcludedIds(newExcluded);
    const filtered = incompleteChars.filter((c) => !newExcluded.has(c.id));
    const result = recommendTeam(dungeon.name, filtered);
    setRecommendationResult(result);
  }

  function handleGuide() {
    setShowGuide(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDragEnter(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const charId = parseInt(e.dataTransfer.getData("text/plain"));
    if (!charId || completedCharIds.has(charId)) return;
    onAdd(dungeon.id, charId, 1);
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        onDragOver={canDrag ? handleDragOver : undefined}
        onDragEnter={canDrag ? handleDragEnter : undefined}
        onDragLeave={canDrag ? handleDragLeave : undefined}
        onDrop={canDrag ? handleDrop : undefined}
        className={`rounded-lg p-3 shrink-0 min-w-80 flex flex-col h-full ${variantClass} ${dragOver && canDrag ? "ring-2 ring-orange-400/60" : ""}`}
      >
        <div className="flex items-center justify-between mb-2">
          <TooltipCell
            content={
              <div className="text-xs space-y-0.5">
                {incompleteChars.length > 0 ? (
                  <>
                    <p className="font-medium text-orange-300">
                      Faltan por hacer:
                    </p>
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
              <span className="font-semibold hover:text-orange-200 transition-colors">
                {dungeon.name}
              </span>
              <span className="text-yellow-500 font-bold">{dungTotal}</span>
            </span>
          </TooltipCell>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="text-xs bg-orange-400 hover:bg-orange-300 rounded px-2 py-1 cursor-pointer text-black">
                <PlusIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-64 bg-[#0d2733] border border-gray-600 text-white"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Añadir personaje</p>
                {selectedChar && (
                  <button
                    onClick={() => { handleRecommend(selectedChar); setPopoverOpen(false); }}
                    className="text-xs bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 cursor-pointer font-medium text-white whitespace-nowrap"
                  >
                    Al Builder
                  </button>
                )}
              </div>
              <Combobox
                items={incompleteChars}
                value={selectedChar}
                onValueChange={(item) => setSelectedChar(item)}
                itemToStringLabel={(item) =>
                  item ? `${item.char} — ${item.class} (${item.charrole})` : ""
                }
                itemToStringValue={(item) => (item && item.id ? item.id.toString() : "")}
              >
                <ComboboxInput placeholder="Buscar personaje..." />
                <ComboboxContent className="bg-[#163544] border border-gray-600 text-white">
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
                  {STASIS_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedChar}
                  className="text-xs bg-orange-400 hover:bg-orange-300 disabled:opacity-40 rounded px-3 py-1.5 cursor-pointer font-medium text-black"
                >
                  Añadir
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={() => handleRecommend()}
            className="text-xs bg-orange-400 hover:bg-orange-300 rounded px-2 py-1 cursor-pointer text-black"
            title="Recomendar equipo"
          >
            Equipo
          </button>
          <button
            onClick={handleGuide}
            className="text-xs bg-orange-400 hover:bg-orange-300 rounded px-2 py-1 cursor-pointer text-black"
            title="Ver guía"
          >
            Guía
          </button>
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
                      value={r.stasis}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (v !== r.stasis) onUpdateStasis(r.id, v);
                      }}
                      className="w-12 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-0.5"
                    >
                      {STASIS_OPTIONS.map((n) => (
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
      {showRecommender && (
        <TeamRecommendationModal
          dungeonName={dungeon.name}
          dungeon={dungeon}
          result={recommendationResult}
          incompleteChars={incompleteChars}
          onAddTeam={onAddTeam}
          onRerolear={handleRerolear}
          presetChar={presetChar}
          onClose={() => setShowRecommender(false)}
        />
      )}
      {showGuide && (
        <DungeonGuideModal
          dungeonName={dungeon.name}
          html={getGuide(dungeon.name)}
          onClose={() => setShowGuide(false)}
        />
      )}
    </TooltipProvider>
  );
}
