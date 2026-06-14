import { useRef, useEffect, useState, Fragment } from "react";
import DungeonCard from "@/components/DungeonCard";
import CharacterCard from "@/components/CharacterCard";
import FilterBar from "@/components/FilterBar";
import PadresAusentes from "@/components/PadresAusentes";
import RoleSelector from "@/components/RoleSelector";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { STASIS_OPTIONS } from "@/lib/constants";
import { useIsFinePointer } from "@/lib/utils";

export default function RecompensasTab({
  searchFilteredInactives,
  inactivePlayers,
  playerFilter,
  setPlayerFilter,
  roleFilter,
  setRoleFilter,
  availableRoles,
  searchCharacters,
  setSearchCharacters,
  dungeons,
  dungRewardMap,
  charMap,
  rewardMap,
  dungeonFilter,
  setDungeonFilter,
  addDungeonReward,
  deleteReward,
  updateStasis,
  addDungeonTeamReward,
  handleOpenBuilder,
  highlightedDungeonNames,
  moduloxDungeonNames,
  sortedChars,
  totalStasis,
  togglePadreAusente,
}) {
  const scrollRef = useRef(null);
  const canDrag = useIsFinePointer();
  const [listDragOver, setListDragOver] = useState(false);
  const [listInsertIdx, setListInsertIdx] = useState(0);
  const [dragCharId, setDragCharId] = useState(null);
  const [showDungeonPicker, setShowDungeonPicker] = useState(false);
  const [pickerDungeon, setPickerDungeon] = useState(null);
  const [pickerStasis, setPickerStasis] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onWheel(e) {
      if (e.target.closest(".vertical-scroll")) return;
      if (e.deltaY !== 0) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  function handleListDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setListDragOver(true);
    const container = scrollRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const cursorX = e.clientX - containerRect.left + container.scrollLeft;
    let idx = 0;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      if (child.hasAttribute("data-placeholder")) continue;
      const childRect = child.getBoundingClientRect();
      if (childRect.width === 0) continue;
      const childRight = childRect.left - containerRect.left + childRect.width + container.scrollLeft;
      if (cursorX > childRight - 8) idx = i + 1;
    }
    setListInsertIdx(Math.min(idx, visibleDungeons.length));
  }

  function handleListDragLeave(e) {
    if (e.relatedTarget?.hasAttribute?.("data-placeholder")) return;
    setListDragOver(false);
    setShowDungeonPicker(false);
    setDragCharId(null);
  }

  function handleListDrop(e) {
    e.preventDefault();
    const charId = parseInt(e.dataTransfer.getData("text/plain"));
    if (!charId) return;
    setDragCharId(charId);
    setPickerDungeon(null);
    setPickerStasis(1);
    setShowDungeonPicker(true);
  }

  function handlePickerSubmit() {
    if (!pickerDungeon || !dragCharId) return;
    addDungeonReward(pickerDungeon.id, dragCharId, pickerStasis);
    setShowDungeonPicker(false);
    setListDragOver(false);
    setDragCharId(null);
  }

  const draggedChar = dragCharId ? charMap[dragCharId] : null;
  const completedDungIdsForDragChar = dragCharId
    ? new Set((rewardMap[dragCharId] || []).map((r) => r.dung))
    : new Set();
  const visibleDungeons = dungeons.filter(
    (d) =>
      dungRewardMap[d.id] &&
      d.name.toLowerCase().includes(dungeonFilter.toLowerCase()),
  );

  function renderPlaceholder() {
    if (showDungeonPicker) {
      return (
        <div data-placeholder="true" className="bg-[#163544] rounded-lg p-3 shrink-0 min-w-80 flex flex-col gap-2 border-2 border-dashed border-orange-400/60 text-sm">
          <p className="font-medium text-orange-300">
            Añadir {draggedChar?.char || "personaje"}
          </p>
          <Combobox
            items={dungeons.filter((d) => !completedDungIdsForDragChar.has(d.id))}
            value={pickerDungeon}
            onValueChange={(item) => setPickerDungeon(item)}
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
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Stasis:</label>
            <select
              value={pickerStasis}
              onChange={(e) => setPickerStasis(parseInt(e.target.value))}
              className="flex-1 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-1"
            >
              {STASIS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePickerSubmit}
            disabled={!pickerDungeon}
            className="w-full text-sm bg-orange-400 hover:bg-orange-300 disabled:opacity-40 rounded px-3 py-1.5 cursor-pointer font-medium text-black"
          >
            Añadir
          </button>
        </div>
      );
    }
    return (
      <div data-placeholder="true" className="bg-[#163544]/50 rounded-lg p-3 shrink-0 min-w-80 flex flex-col items-center justify-center border-2 border-dashed border-orange-400/60 text-gray-400 text-sm pointer-events-none">
        Suelta aquí para elegir mazmorra
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[25%_1fr] gap-4 items-stretch flex-1 min-h-0">
        <section className="bg-[#0d2733] rounded-lg p-3 flex flex-col max-h-[50vh] lg:max-h-none lg:h-0 lg:min-h-full">
          <div className="flex flex-col gap-2 mb-4 shrink-0">
            <h2 className="text-lg font-semibold text-orange-300">
              Personajes ({searchFilteredInactives.length})
            </h2>
            <div className="w-full flex flex-col gap-3">
              <FilterBar
                players={inactivePlayers}
                currentFilter={playerFilter}
                onFilter={setPlayerFilter}
              />
              <RoleSelector
                availableRoles={availableRoles}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
              />
            </div>
          </div>

          <div className="mb-3 shrink-0">
            <input
              type="text"
              placeholder="Buscar personaje por nombre..."
              value={searchCharacters}
              onChange={(e) => setSearchCharacters(e.target.value)}
              className="w-full p-2 text-sm rounded bg-[#163a4a] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          <div className="flex-1 overflow-y-auto vertical-scroll min-h-0 pr-1.5">
            {searchFilteredInactives.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {searchCharacters || roleFilter || playerFilter
                  ? "No hay coincidencias para los filtros seleccionados"
                  : "No hay personajes registrados en el sistema"}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {searchFilteredInactives.map((c) => (
                  <CharacterCard
                    key={c.id}
                    character={c}
                    onAddReward={addDungeonReward}
                    onOpenBuilder={handleOpenBuilder}
                    dungeons={dungeons}
                    rewardMap={rewardMap}
                    onTogglePadre={togglePadreAusente}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#0d2733] rounded-lg p-4 flex flex-col max-h-[50vh] lg:max-h-none lg:h-0 lg:min-h-full overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-300">
              Clasificación Mazmorras
            </h2>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-yellow-400">
                {totalStasis}
              </span>
              <span className="text-sm text-gray-400">cofres</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Filtrar mazmorra..."
            value={dungeonFilter}
            onChange={(e) => setDungeonFilter(e.target.value)}
            className="mt-2 mb-3 w-full bg-[#163544] border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-orange-300"
          />
          <div
            ref={scrollRef}
            onDragOver={canDrag ? handleListDragOver : undefined}
            onDragLeave={canDrag ? handleListDragLeave : undefined}
            onDrop={canDrag ? handleListDrop : undefined}
            className="flex gap-4 pb-2 overflow-x-auto min-w-0 horizontal-scroll flex-1 min-h-0 items-stretch"
          >
            {visibleDungeons.flatMap((d, i) => {
              const items = [];
              if (listDragOver && listInsertIdx === i) {
                items.push(
                  <Fragment key="placeholder">
                    {renderPlaceholder()}
                  </Fragment>,
                );
              }
              items.push(
                <DungeonCard
                  key={d.id}
                  dungeon={d}
                  rewards={dungRewardMap[d.id]}
                  charMap={charMap}
                  onAdd={addDungeonReward}
                  onDelete={deleteReward}
                  onUpdateStasis={updateStasis}
                  onAddTeam={addDungeonTeamReward}
                  highlightedDungeonNames={highlightedDungeonNames}
                  moduloxDungeonNames={moduloxDungeonNames}
                />,
              );
              return items;
            })}
            {listDragOver && visibleDungeons.length === listInsertIdx && (
              <Fragment key="placeholder-end">
                {renderPlaceholder()}
              </Fragment>
            )}
          </div>
        </section>
      </div>

      <PadresAusentes
        characters={sortedChars}
        onTogglePadre={togglePadreAusente}
      />
    </>
  );
}
