import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";

const SPREADSHEET_ID = "1YXdxmQC9U3Ux7AuNnT8Cm3DR7kp1YYHenWuU3eQ5wbY";
const SPREADSHEET_SHEET = "[ES] Previsión";
const SPREADSHEET_API_KEY = import.meta.env.PUBLIC_VITE_GOOGLESHEET_KEY;

const SPREADSHEET_TO_APP = {
  "Guarida de los Tejaroxores": "Cojonidas 🍯🦡",
  "Volcán Or'Hodruin": "Señor de la Llama 🦙🌋",
  "Pico del Monte Zinit": "Ogrest 😭🦍",
  "Santuario de los Dragohuevos": "Dragohuevos 🐲🥚",
  "Cresta Helada": "Eternos 🌪️",
  "La Torre Mineral (lvl 200)": "Torre Mineral 🗼",
  "Cañón de los Plaguepardos": "Plaguepardos 🐯",
  "Fábrica de Buhatrás": "Buhatrás 🦉",
  "Tumba de Pandala": "Pandala 👻🐼",
  "Mazmorra Nievajas": "Nievajas 🐺",
  "Mazmorra Crustariscos": "Crustariscos 🦐",
  "Mazmorra Solgazanes": "Solgazanes 🦂",
  "Mazmorra Vandalienados": "Vandalienados 🐗",
  "Mazmorra de los Plantiguardias": "Plantigrados 🐻‍❄️🍯",
  "Mazmorra de los Güinos": "aaa Sumorsa 👑🦭",
  "Mazmorra de los Escapatarazones": "Escapatrajos 🐢卍",
  "Mazmorra de los Fitoformes": "Pitoformes 🍆",
  "Mazmorra de los Demorribles": "Feos 🩸🦇",
  "Mazmorra de los Vaciantes": "Ar'mando 🌮",
  "Mazmorra de los Idos": "Locos 👁️👁️",
  "Mazmorra de los Devastadores": "Muertos 🧟💀",
  "Mazmorra Steamers": "Pechofríos",
  "Mazmorra Pezgajosos Abisales": "Pegajosos",
  Necromundo: "Muertohambres",
};

import DungeonCard from "@/components/DungeonCard";
import CharacterCard from "@/components/CharacterCard";
import AddRewardModal from "@/components/AddRewardModal";
import FilterBar from "@/components/FilterBar";
import { Toaster } from "@/components/ui/sonner";
import PadresAusentes from "@/components/PadresAusentes";
import RoleSelector from "@/components/RoleSelector";
import DailiesButton from "@/components/DailiesButton";

// Controlador principal: carga datos, gestiona recompensas y renderiza las secciones
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
  const [searchCharacters, setSearchCharacters] = useState(""); // Filtro para buscar personajes por nombre
  const [roleFilter, setRoleFilter] = useState(""); // Filtro para buscar personajes por rol
  const [highlightedDungeonNames, setHighlightedDungeonNames] = useState(
    new Set(),
  );
  const [moduloxDungeonNames, setModuloxDungeonNames] = useState(new Set());
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
  }, [loading]);

  useEffect(() => {
    async function fetchTodayDailies() {
      const base = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SPREADSHEET_SHEET)}`;
      try {
        const [dailyRes, moduloxRes] = await Promise.all([
          fetch(`${base}!D4:D19?key=${SPREADSHEET_API_KEY}`),
          fetch(`${base}!D21:D25?key=${SPREADSHEET_API_KEY}`),
        ]);
        const dailyData = await dailyRes.json();
        const moduloxData = await moduloxRes.json();
        if (dailyData.values) {
          const names = dailyData.values
            .map((row) => SPREADSHEET_TO_APP[row[0]])
            .filter(Boolean);
          setHighlightedDungeonNames(new Set(names));
        }
        if (moduloxData.values) {
          const names = moduloxData.values
            .map((row) => SPREADSHEET_TO_APP[row[0]])
            .filter(Boolean);
          setModuloxDungeonNames(new Set(names));
        }
      } catch {
        // spreadsheet fetch failed silently
      }
    }
    loadData();
    fetchTodayDailies();
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
      const char = charMap[addChar];
      const dung = dungeons.find((d) => d.id === parseInt(addDung));
      const sufijo = char?.gender === 1 ? "añadida" : "añadido";
      toast.success(
        `${char?.char || "Personaje"} ${sufijo} a ${dung?.name || "mazmorra"}`,
      );
      setShowAdd(false);
      setAddChar("");
      setAddDung("");
      setAddStasis(1);
      loadData();
    }
  }

  // Elimina una recompensa por su ID
  async function deleteReward(id) {
    const reward = rewards.find((r) => r.id === id);
    const char = reward ? charMap[reward.char] : null;
    const dungName = reward
      ? dungeons.find((d) => d.id === reward.dung)?.name
      : null;
    await supabase.from("wakfurewards").delete().eq("id", id);
    loadData();
    if (char) {
      const sufijo = char.gender === 1 ? "eliminada" : "eliminado";
      toast.success(`${char.char} ${sufijo} de ${dungName}`);
    }
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
    await supabase.from("wakfurewards").delete().gt("id", 0);
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

  async function togglePadreAusente(character) {
    const nuevoRol =
      character.charrole === "Padre Ausente" ? "xD" : "Padre Ausente";

    const { error } = await supabase
      .from("wakfuchars")
      .update({ charrole: nuevoRol })
      .eq("id", character.id);

    if (error) {
      toast.error("Error al cambiar el estado: " + error.message);
      return;
    }

    toast.success(
      nuevoRol === "Padre Ausente"
        ? `${character.char} enviado a Padre Ausente`
        : `${character.char} ha regresado a la lista activa`,
    );

    await loadData(); // Recarga los datos de Supabase para actualizar la pantalla
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
  ]
    .filter(Boolean)
    .sort();

  const searchFilteredInactives = (
    playerFilter
      ? sortedChars.filter((c) => c.player === playerFilter)
      : sortedChars
  ).filter((c) => {
    const matchesRole = roleFilter ? c.charrole === roleFilter : true;
    const matchesName = c?.char
      ? c.char.toLowerCase().includes(searchCharacters.toLowerCase())
      : false;
    return c.charrole !== "Padre Ausente" && matchesRole && matchesName;
  });

  const totalStasis = rewards.reduce((s, r) => s + r.stasis, 0);

  // Abre el modal con un personaje preseleccionado
  function handleAdd(characterId) {
    setAddChar(String(characterId));
    setAddDung("");
    setShowAdd(true);
  }

  const modalChars = sortedChars.filter((c) => c.charrole !== "Padre Ausente");

  // Añade directamente una recompensa desde el popover de la tarjeta de mazmorra
  async function addDungeonReward(dungId, charId, stasis) {
    const { error } = await supabase.from("wakfurewards").insert({
      char: parseInt(charId),
      dung: parseInt(dungId),
      stasis: parseInt(stasis),
    });
    if (!error) {
      const char = charMap[charId];
      const dung = dungeons.find((d) => d.id === parseInt(dungId));
      const sufijo = char?.gender === 1 ? "añadida" : "añadido";
      toast.success(
        `${char?.char || "Personaje"} ${sufijo} a ${dung?.name || "mazmorra"}`,
      );
      loadData();
    }
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
    <div className="p-4 space-y-6 flex flex-col min-h-screen">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">Recompensas Fin de Mes</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{countdown()}</span>
            <DailiesButton
              dailyDungeons={highlightedDungeonNames}
              moduloxDungeons={moduloxDungeonNames}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white px-4 py-1 rounded hover:cursor-pointer"
              onClick={resetRewards}
            >
              Resetear
            </button>
            <span className="text-2xl font-bold text-yellow-400">
              {totalStasis}
            </span>
            <span className="text-lg text-gray-400">cofres</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr] gap-4 items-stretch flex-1 min-h-0">
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
                    onAdd={handleAdd}
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
          <h2 className="text-lg font-semibold text-green-300">
            Clasificación Mazmorras
          </h2>
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
        highlightedDungeonNames={highlightedDungeonNames}
        moduloxDungeonNames={moduloxDungeonNames}
      />
      <Toaster />
    </div>
  );
}
