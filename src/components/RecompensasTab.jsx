import { useRef, useEffect, useState, Fragment } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import * as db from "@/lib/db";
import DungeonCard from "@/components/DungeonCard";
import CharacterCard from "@/components/CharacterCard";
import FilterBar from "@/components/FilterBar";
import PadresAusentes from "@/components/PadresAusentes";
import RoleSelector from "@/components/RoleSelector";
import TeamRecommendationModal from "@/components/TeamRecommendationModal";
import { recommendTeam } from "@/lib/teamRecommender";
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
  highlightedDungeonNames = new Set(),
  moduloxDungeonNames = new Set(),
}) {
  const [characters, setCharacters] = useState([]);
  const [dungeons, setDungeons] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [playerFilter, setPlayerFilter] = useState(null);
  const [dungeonFilter, setDungeonFilter] = useState("");
  const [searchCharacters, setSearchCharacters] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [builderDungeonId, setBuilderDungeonId] = useState(null);
  const [builderPresetChar, setBuilderPresetChar] = useState(null);
  const [builderResult, setBuilderResult] = useState(null);
  const [builderRerolearExcludedIds, setBuilderRerolearExcludedIds] = useState(new Set());

  const scrollRef = useRef(null);
  const canDrag = useIsFinePointer();
  const [listDragOver, setListDragOver] = useState(false);
  const [listInsertIdx, setListInsertIdx] = useState(0);
  const [dragCharId, setDragCharId] = useState(null);
  const [showDungeonPicker, setShowDungeonPicker] = useState(false);
  const [pickerDungeon, setPickerDungeon] = useState(null);
  const [pickerStasis, setPickerStasis] = useState(1);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("wakfurewards-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wakfurewards" },
        () => loadData(),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadData() {
    const [chars, dungs, rwds] = await Promise.all([
      db.fetchCharacters(),
      db.fetchDungeons(),
      db.fetchRewards(),
    ]);
    setCharacters(chars);
    setDungeons(dungs);
    setRewards(rwds);
    setLoading(false);
  }

  const rewardMap = {};
  rewards.forEach((r) => {
    if (!rewardMap[r.char]) rewardMap[r.char] = [];
    rewardMap[r.char].push(r);
  });

  const charMap = {};
  characters.forEach((c) => { charMap[c.id] = c; });

  const dungRewardMap = {};
  rewards.forEach((r) => {
    if (!dungRewardMap[r.dung]) dungRewardMap[r.dung] = [];
    dungRewardMap[r.dung].push(r);
  });

  const sortedChars = [...characters].sort((a, b) => {
    if (a.player !== b.player) return a.player.localeCompare(b.player);
    return a.char.localeCompare(b.char);
  });

  const inactivePlayers = [
    ...new Set(
      sortedChars
        .filter((c) => c.charrole !== "Padre Ausente")
        .map((c) => c.player),
    ),
  ].sort((a, b) => {
    const ordenManual = ["Peballo", "Juanio", "Visama"];
    const indexA = ordenManual.indexOf(a);
    const indexB = ordenManual.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const availableRoles = [
    ...new Set(
      sortedChars
        .filter((c) => c.charrole !== "Padre Ausente")
        .map((c) => c.charrole),
    ),
  ].filter(Boolean).sort();

  const searchFilteredInactives = (
    playerFilter
      ? sortedChars.filter((c) => c.player === playerFilter)
      : sortedChars
  ).filter((c) => {
    const matchesRole = roleFilter ? c.charrole === roleFilter : true;
    const matchesName = c.char
      .toLowerCase()
      .includes(searchCharacters.toLowerCase());
    return c.charrole !== "Padre Ausente" && matchesRole && matchesName;
  });

  const totalStasis = rewards.reduce((s, r) => s + r.stasis, 0);

  function getAvailableChars(dungeonId) {
    const completedCharIds = new Set(
      (dungRewardMap[dungeonId] || []).map((r) => r.char),
    );
    return sortedChars.filter(
      (c) => !completedCharIds.has(c.id) && c.charrole !== "Padre Ausente",
    );
  }

  function handleOpenBuilder(dungeonId, presetChar) {
    setBuilderDungeonId(dungeonId);
    setBuilderPresetChar(presetChar);
    const chars = getAvailableChars(dungeonId);
    const dungeon = dungeons.find((d) => d.id === dungeonId);
    if (dungeon) {
      const result = recommendTeam(dungeon.name, chars);
      setBuilderResult(result);
    }
    setBuilderRerolearExcludedIds(new Set());
  }

  function handleBuilderRerolear(teamCharIds) {
    const newExcluded = new Set(builderRerolearExcludedIds);
    teamCharIds.forEach((id) => newExcluded.add(id));
    setBuilderRerolearExcludedIds(newExcluded);
    const dungeon = dungeons.find((d) => d.id === builderDungeonId);
    if (!dungeon) return;
    const chars = getAvailableChars(builderDungeonId);
    const filtered = chars.filter((c) => !newExcluded.has(c.id));
    const result = recommendTeam(dungeon.name, filtered);
    setBuilderResult(result);
  }

  async function deleteReward(id) {
    const reward = rewards.find((r) => r.id === id);
    const char = reward ? charMap[reward.char] : null;
    const dungName = reward
      ? dungeons.find((d) => d.id === reward.dung)?.name
      : null;
    await db.deleteReward(id);
    loadData();
    if (char) {
      const sufijo = char.gender === 1 ? "eliminada" : "eliminado";
      toast.success(`${char.char} ${sufijo} de ${dungName}`);
    }
  }

  async function addDungeonReward(dungId, charId, stasis) {
    try {
      await db.addDungeonReward(dungId, charId, stasis);
      const char = charMap[charId];
      const dung = dungeons.find((d) => d.id === parseInt(dungId));
      const sufijo = char?.gender === 1 ? "añadida" : "añadido";
      toast.success(`${char?.char || "Personaje"} ${sufijo} a ${dung?.name || "mazmorra"}`);
      loadData();
    } catch (e) {
      console.error("Error al insertar:", e);
      toast.error("Error al añadir: " + e.message);
    }
  }

  async function addDungeonTeamReward(dungId, teamMembers, stasis) {
    if (!teamMembers || teamMembers.length === 0) {
      toast.error("No hay personajes para añadir");
      return;
    }
    try {
      await db.addDungeonTeamReward(dungId, teamMembers, stasis);
      const dung = dungeons.find((d) => d.id === parseInt(dungId));
      toast.success(`Equipo añadido a ${dung?.name || "mazmorra"}`);
      loadData();
    } catch (e) {
      toast.error("Error al añadir equipo: " + e.message);
    }
  }

  async function updateStasis(id, val) {
    try {
      await db.updateStasis(id, val);
      await loadData();
    } catch (e) {
      alert("Error al actualizar: " + e.message);
    }
  }

  async function togglePadreAusente(character) {
    const nuevoRol = character.charrole === "Padre Ausente" ? "xD" : "Padre Ausente";
    try {
      await db.togglePadreAusente(character.id, nuevoRol);
      toast.success(
        nuevoRol === "Padre Ausente"
          ? `${character.char} enviado a Padre Ausente`
          : `${character.char} ha regresado a la lista activa`,
      );
      await loadData();
    } catch (e) {
      toast.error("Error al cambiar el estado: " + e.message);
    }
  }

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

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Cargando...</div>;
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
                <option key={n} value={n}>{n}</option>
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
                  <Fragment key={`placeholder-${i}`}>
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

      {builderDungeonId &&
        builderResult &&
        (() => {
          const dungeon = dungeons.find((d) => d.id === builderDungeonId);
          if (!dungeon) return null;
          const chars = getAvailableChars(builderDungeonId);
          return (
            <TeamRecommendationModal
              dungeonName={dungeon.name}
              dungeon={dungeon}
              result={builderResult}
              incompleteChars={chars}
              onAddTeam={addDungeonTeamReward}
              onRerolear={handleBuilderRerolear}
              presetChar={builderPresetChar}
              onClose={() => {
                setBuilderDungeonId(null);
                setBuilderPresetChar(null);
                setBuilderResult(null);
              }}
            />
          );
        })()}
    </>
  );
}
