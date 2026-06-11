import { useState, useRef, useEffect } from "react";
import ClassIcon from "@/components/ClassIcon";
import RoleBadge from "@/components/RoleBadge";
import { STASIS_OPTIONS } from "@/lib/constants";
import { getProfile } from "@/data/dungeonProfiles";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

export default function TeamRecommendationModal({
  dungeonName,
  dungeon,
  result,
  incompleteChars,
  onAddTeam,
  onRerolear,
  presetChar,
  onClose,
}) {
  if (!result) return null;

  const [displayTeamIndex, setDisplayTeamIndex] = useState(0);
  const bestTeam = result.teams?.[displayTeamIndex]?.members || [];
  const teamSize = getProfile(dungeonName).teamSize;

  const [slots, setSlots] = useState(
    Array.from({ length: teamSize }, (_, i) =>
      i === 0 && presetChar ? presetChar : null,
    ),
  );
  const [recommendedStasis, setRecommendedStasis] = useState(1);
  const [customStasis, setCustomStasis] = useState(1);
  const [swipeY, setSwipeY] = useState(0);
  const cardRef = useRef(null);
  const scrollRef = useRef(null);
  const startY = useRef(0);
  const touchActive = useRef(false);

  useEffect(() => {
    document.body.style.overscrollBehavior = "contain";
    return () => { document.body.style.overscrollBehavior = ""; };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    function onTouchStart(e) {
      touchActive.current = true;
      startY.current = e.touches[0].clientY;
    }

    function onTouchMove(e) {
      if (!touchActive.current) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        const scroll = scrollRef.current;
        if (!scroll || !scroll.contains(e.target) || scroll.scrollTop === 0) {
          e.preventDefault();
          setSwipeY(dy);
        }
      }
    }

    function onTouchEnd() {
      touchActive.current = false;
      setSwipeY((current) => {
        if (current > 100) onClose();
        return 0;
      });
    }

    card.addEventListener("touchstart", onTouchStart, { passive: true });
    card.addEventListener("touchmove", onTouchMove, { passive: false });
    card.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      card.removeEventListener("touchstart", onTouchStart);
      card.removeEventListener("touchmove", onTouchMove);
      card.removeEventListener("touchend", onTouchEnd);
    };
  }, [onClose]);

  function handleSlotChange(index, character) {
    const newSlots = [...slots];
    newSlots[index] = character;
    setSlots(newSlots);
  }

  function getAvailableChars(slotIndex) {
    const selectedIds = new Set(
      slots
        .filter((_, i) => i !== slotIndex)
        .filter(Boolean)
        .map((c) => c.id),
    );
    return incompleteChars.filter((c) => !selectedIds.has(c.id));
  }

  function handleAddRecommendedTeam() {
    onAddTeam(dungeon.id, bestTeam, recommendedStasis);
    onClose();
  }

  function handleFill() {
    setSlots((prev) => {
      const selectedIds = new Set(prev.filter(Boolean).map((c) => c.id));
      const available = bestTeam.filter((c) => !selectedIds.has(c.id));
      const next = [...prev];
      let idx = 0;
      for (let i = 0; i < next.length; i++) {
        if (!next[i] && idx < available.length) {
          next[i] = available[idx];
          idx++;
        }
      }
      return next;
    });
  }

  function handleAddCustomTeam() {
    const selectedIds = new Set(slots.filter(Boolean).map((c) => c.id));
    const filledSlots = slots.map((slot) => {
      if (slot) return slot;
      const nextBest = bestTeam.find((c) => !selectedIds.has(c.id));
      if (nextBest) {
        selectedIds.add(nextBest.id);
        return nextBest;
      }
      return null;
    });

    const finalTeam = filledSlots.filter(Boolean);
    if (finalTeam.length === 0) return;

    onAddTeam(dungeon.id, finalTeam, customStasis);
    onClose();
  }

  function handleRerolear() {
    const teams = result.teams;
    if (!teams || teams.length === 0) return;
    const currentTeam = teams[displayTeamIndex]?.members;
    if (!currentTeam) return;
    setDisplayTeamIndex(0);
    onRerolear(currentTeam.map((c) => c.id));
  }

  function handleMoverAbajo() {
    setSlots(bestTeam.slice(0, teamSize));
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: swipeY > 0 ? `translateY(${swipeY}px)` : "",
        }}
        className="bg-[#0d2733] rounded-t-2xl sm:rounded-lg p-6 w-full max-w-2xl border border-gray-600 max-h-[85vh] flex flex-col transition-transform duration-200 ease-out"
      >
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-lg font-semibold text-orange-300">
            Equipo para {dungeonName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl cursor-pointer leading-none"
          >
            ×
          </button>
        </div>

        <div
          ref={scrollRef}
          className="overflow-y-auto vertical-scroll min-h-0 pr-1 space-y-4"
        >
          {result.explanation && (
            <p className="text-sm text-gray-400 italic">
              {result.explanation}
            </p>
          )}

          {result.error ? (
            <p className="text-red-400 text-sm">{result.error}</p>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-300 flex-1">
                  Equipo recomendado
                </p>
                <label className="text-sm text-gray-400">Stasis:</label>
                <select
                  value={recommendedStasis}
                  onChange={(e) => setRecommendedStasis(parseInt(e.target.value))}
                  className="bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-1 px-3"
                >
                  {STASIS_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-1">
                {(() => {
                  const grouped = {};
                  for (const c of [...bestTeam].sort((a, b) => a.player.localeCompare(b.player))) {
                    if (!grouped[c.player]) grouped[c.player] = [];
                    grouped[c.player].push(c);
                  }
                  return Object.values(grouped).map((group, i) => (
                    <div key={i} className="flex flex-col gap-1 sm:flex-1">
                      {group.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 bg-[#163544] rounded px-3 py-1.5 text-sm"
                        >
                          <ClassIcon cls={c.class} gender={c.gender} />
                          <span className="truncate max-w-28">{c.char}</span>
                          <span className="text-gray-400 text-xs">{c.class}</span>
                          <RoleBadge role={c.charrole} />
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
              <div className="flex items-center gap-2 mt-3 justify-end">
                <button
                  onClick={handleRerolear}
                  className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded font-medium text-white cursor-pointer whitespace-nowrap"
                >
                  Rerolear
                </button>
                <button
                  onClick={handleMoverAbajo}
                  className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded font-medium text-white cursor-pointer whitespace-nowrap"
                >
                  Mover abajo
                </button>
                <button
                  onClick={handleAddRecommendedTeam}
                  className="px-4 py-2 text-sm bg-orange-400 hover:bg-orange-300 rounded font-medium text-black cursor-pointer whitespace-nowrap"
                >
                  Añadir equipo
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-600" />
            <span className="text-xs text-gray-500">o</span>
            <div className="h-px flex-1 bg-gray-600" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm text-gray-300 flex-1">
                {result.error
                  ? "Crea tu equipo manualmente:"
                  : "Personaliza el equipo:"}
              </p>
              <label className="text-sm text-gray-400">Stasis:</label>
              <select
                value={customStasis}
                onChange={(e) => setCustomStasis(parseInt(e.target.value))}
                className="bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-1 px-3"
              >
                {STASIS_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {Array.from({ length: teamSize }, (_, i) => (
                <Combobox
                  key={i}
                  items={getAvailableChars(i)}
                  value={slots[i]}
                  onValueChange={(item) => handleSlotChange(i, item)}
                  itemToStringLabel={(item) =>
                    `${item.char} — ${item.class} (${item.charrole})`
                  }
                  itemToStringValue={(item) => item.id.toString()}
                >
                  <ComboboxInput placeholder={`Personaje ${i + 1}...`} />
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
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 justify-end">
              <button
                onClick={handleFill}
                className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded font-medium text-white cursor-pointer whitespace-nowrap"
              >
                Rellenar
              </button>
              <button
                onClick={() => setSlots(Array.from({ length: teamSize }, () => null))}
                className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded font-medium text-white cursor-pointer whitespace-nowrap"
              >
                Vaciar
              </button>
              <button
                onClick={handleAddCustomTeam}
                className="px-4 py-2 text-sm bg-orange-400 hover:bg-orange-300 rounded font-medium text-black cursor-pointer whitespace-nowrap"
              >
                Añadir equipo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
