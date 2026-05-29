import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import ClassIcon from "./ClassIcon";
import DungeonCard from "./DungeonCard";
import CharacterCard from "./CharacterCard";
import AddRewardModal from "./AddRewardModal";
import FilterBar from "./FilterBar";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [dungeons, setDungeons] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [addChar, setAddChar] = useState("");
  const [addDung, setAddDung] = useState("");
  const [addStasis, setAddStasis] = useState(1);
  const [playerFilter, setPlayerFilter] = useState(null);
  const [dungeonFilter, setDungeonFilter] = useState(""); // Filtro de texto para buscar mazmorras en Completados

  useEffect(() => {
    loadData();
  }, []);

  // Carga todos los datos desde Supabase al iniciar
  async function loadData() {
    const [c, d, r] = await Promise.all([
      supabase.from("wakfuchars").select("*").order("id"),
      supabase.from("wakfudungs").select("*").order("id"),
      supabase.from("wakfurewards").select("*"),
    ]);
    if (c.data) setCharacters(c.data);
    if (d.data) setDungeons(d.data);
    if (r.data) setRewards(r.data);
    setLoading(false);
  }

  // Crea una nueva recompensa en Supabase
  async function addReward(e) {
    e.preventDefault();
    const { error } = await supabase.from("wakfurewards").insert({
      char: parseInt(addChar),
      dung: parseInt(addDung),
      stasis: parseInt(addStasis),
    });
    if (!error) {
      setShowAdd(false);
      setAddChar("");
      setAddDung("");
      setAddStasis(1);
      loadData();
    }
  }

  // Elimina una recompensa por su ID
  async function deleteReward(id) {
    await supabase.from("wakfurewards").delete().eq("id", id);
    loadData();
  }

  // Reinicia todas las recompensas del mes
  async function resetRewards() {
    if (
      !window.confirm(
        "¿Seguro que quieres reiniciar todas las recompensas del mes?",
      )
    )
      return;
    setRewards([]);
    localStorage.setItem("wakfu_reset_token", "true");
    await supabase.from("wakfurewards").delete().neq("id", 0);
  }

  // Actualiza el stasis de una recompensa existente
  async function updateStasis(id, val) {
    const { error } = await supabase
      .from("wakfurewards")
      .update({ stasis: val })
      .eq("id", id);
    if (error) {
      alert("Error al actualizar: " + error.message);
      return;
    }
    await loadData();
  }

  // Calcula los días/horas restantes hasta fin de mes
  function countdown() {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `Quedan ${days} días`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `Quedan ${hours} horas`;
  }

  const rewardMap = {};
  rewards.forEach((r) => {
    if (!rewardMap[r.char]) rewardMap[r.char] = [];
    rewardMap[r.char].push(r);
  });

  const dungMap = {};
  dungeons.forEach((d) => {
    dungMap[d.id] = d;
  });

  const charMap = {};
  characters.forEach((c) => {
    charMap[c.id] = c;
  });

  const dungRewardMap = {};
  rewards.forEach((r) => {
    if (!dungRewardMap[r.dung]) dungRewardMap[r.dung] = [];
    dungRewardMap[r.dung].push(r);
  });

  const sortedChars = [...characters].sort((a, b) => {
    if (a.player !== b.player) return a.player.localeCompare(b.player);
    return a.char.localeCompare(b.char);
  });

  const inactives = sortedChars.filter(
    (c) =>
      c.charrole !== "Padre Ausente" &&
      (!rewardMap[c.id] || rewardMap[c.id].length === 0),
  );

  const inactivePlayers = [...new Set(inactives.map((c) => c.player))].sort();
  const filteredInactives = playerFilter
    ? inactives.filter((c) => c.player === playerFilter)
    : inactives;

  const padres = sortedChars.filter((c) => c.charrole === "Padre Ausente");

  const totalStasis = rewards.reduce((s, r) => s + r.stasis, 0);

  // Abre el modal con un personaje preseleccionado
  function handleAdd(characterId) {
    setAddChar(String(characterId));
    setAddDung("");
    setShowAdd(true);
  }

  const modalChars = sortedChars.filter((c) => c.charrole !== "Padre Ausente");

  // Abre el modal con una mazmorra preseleccionada
  function handleAddForDungeon(dungeonId) {
    setAddChar("");
    setAddDung(String(dungeonId));
    setShowAdd(true);
  }

  function handleCharChange(charId) {
    setAddChar(charId);
  }

  const charIdNum = addChar ? parseInt(addChar) : null;
  const completedDungIds = charIdNum
    ? new Set((rewardMap[charIdNum] || []).map((r) => r.dung))
    : new Set();
  const availableDungeons = dungeons.filter((d) => !completedDungIds.has(d.id));

  const dungIdNum = addDung ? parseInt(addDung) : null;
  const completedCharIds = dungIdNum
    ? new Set((dungRewardMap[dungIdNum] || []).map((r) => r.char))
    : new Set();
  const availableChars = modalChars.filter((c) => !completedCharIds.has(c.id));

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Cargando...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recompensas Fin de Mes</h1>
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-gray-400">{countdown()}</span>
          <button
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white px-4 py-2 rounded"
            onClick={resetRewards}
          >
            Resetear
          </button>
          <span className="text-2xl font-bold text-yellow-400">
            {totalStasis}
          </span>
          <span className="text-lg text-gray-400">cofres</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr] gap-4">
        <section className="bg-[#0d2733] rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-orange-300">
              Pendientes ({filteredInactives.length})
            </h2>
            <FilterBar
              players={inactivePlayers}
              currentFilter={playerFilter}
              onFilter={setPlayerFilter}
            />
          </div>
          {filteredInactives.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {playerFilter
                ? `${playerFilter} no tiene personajes pendientes`
                : "Todos han completado al menos una mazmorra este mes"}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredInactives.map((c) => (
                <CharacterCard key={c.id} character={c} onAdd={handleAdd} />
              ))}
            </div>
          )}
        </section>

        <section
          className="bg-[#0d2733] rounded-lg p-4 overflow-x-auto min-w-0 horizontal-scroll"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
              e.preventDefault();
            }
          }}
        >
          <h2 className="text-lg font-semibold text-green-300">
            Completados
          </h2>
          <input
            type="text"
            placeholder="Filtrar mazmorra..."
            value={dungeonFilter}
            onChange={(e) => setDungeonFilter(e.target.value)}
            className="mt-2 mb-3 w-full bg-[#163544] border border-gray-600 rounded px-3 py-1.5 text-sm"
          />
          <div className="flex gap-4 pb-2">
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
                  onAdd={handleAddForDungeon}
                  onDelete={deleteReward}
                  onUpdateStasis={updateStasis}
                />
              ))}
          </div>
        </section>
      </div>

      {padres.length > 0 && (
        <section className="bg-[#0d2733] rounded-lg p-4 opacity-60">
          <h2 className="text-lg font-semibold text-gray-400 mb-2">
            Padre Ausente
          </h2>
          <div className="flex flex-wrap gap-2">
            {padres.map((c) => (
              <span
                key={c.id}
                className="text-sm text-gray-400 flex items-center gap-1"
              >
                <ClassIcon cls={c.class} gender={c.gender} />
                {c.char} ({c.class})
              </span>
            ))}
          </div>
        </section>
      )}

      <AddRewardModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={addReward}
        characters={availableChars}
        dungeons={availableDungeons}
        charValue={addChar}
        dungValue={addDung}
        stasisValue={addStasis}
        onCharChange={handleCharChange}
        onDungChange={setAddDung}
        onStasisChange={setAddStasis}
      />

    </div>
  );
}
