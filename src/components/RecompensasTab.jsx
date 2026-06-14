import { useRef, useEffect } from "react";
import DungeonCard from "@/components/DungeonCard";
import CharacterCard from "@/components/CharacterCard";
import FilterBar from "@/components/FilterBar";
import PadresAusentes from "@/components/PadresAusentes";
import RoleSelector from "@/components/RoleSelector";

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
            className="flex gap-4 pb-2 overflow-x-auto min-w-0 horizontal-scroll flex-1 min-h-0 items-stretch"
          >
            {dungeons
              .filter(
                (d) =>
                  dungRewardMap[d.id] &&
                  d.name.toLowerCase().includes(dungeonFilter.toLowerCase()),
              )
              .map((d) => (
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
                />
              ))}
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
