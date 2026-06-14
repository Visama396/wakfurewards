import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import pkg from "../../package.json";
import { Menu, X } from "lucide-react";

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

import TeamRecommendationModal from "@/components/TeamRecommendationModal";
import { recommendTeam } from "@/lib/teamRecommender";
import DailiesButton from "@/components/DailiesButton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecompensasTab from "@/components/RecompensasTab";
import BuildsTab from "@/components/BuildsTab";
import GuiasTab from "@/components/GuiasTab";
import CompraTab from "@/components/CompraTab";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [dungeons, setDungeons] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [playerFilter, setPlayerFilter] = useState(null);
  const [dungeonFilter, setDungeonFilter] = useState("");
  const [searchCharacters, setSearchCharacters] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [highlightedDungeonNames, setHighlightedDungeonNames] = useState(
    new Set(),
  );
  const [moduloxDungeonNames, setModuloxDungeonNames] = useState(new Set());
  const [builderDungeonId, setBuilderDungeonId] = useState(null);
  const [builderPresetChar, setBuilderPresetChar] = useState(null);
  const [builderResult, setBuilderResult] = useState(null);
  const [builderRerolearExcludedIds, setBuilderRerolearExcludedIds] = useState(
    new Set(),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  function handleOpenBuilder(dungeonId, presetChar) {
    setBuilderDungeonId(dungeonId);
    setBuilderPresetChar(presetChar);
    const completedCharIds = new Set(
      (dungRewardMap[dungeonId] || []).map((r) => r.char),
    );
    const chars = sortedChars.filter(
      (c) => !completedCharIds.has(c.id) && c.charrole !== "Padre Ausente",
    );
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
    const completedCharIds = new Set(
      (dungRewardMap[builderDungeonId] || []).map((r) => r.char),
    );
    const chars = sortedChars.filter(
      (c) => !completedCharIds.has(c.id) && c.charrole !== "Padre Ausente",
    );
    const filtered = chars.filter((c) => !newExcluded.has(c.id));
    const result = recommendTeam(dungeon.name, filtered);
    setBuilderResult(result);
  }

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

    const channel = supabase
      .channel("wakfurewards-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wakfurewards" },
        () => loadData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

    await loadData();
  }

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

  async function addDungeonReward(dungId, charId, stasis) {
    const payload = {
      char: parseInt(charId),
      dung: parseInt(dungId),
      stasis: parseInt(stasis),
    };
    const { error } = await supabase.from("wakfurewards").insert(payload);
    if (error) {
      console.error("Error al insertar:", error);
      toast.error("Error al añadir: " + error.message);
      return;
    }
    const char = charMap[charId];
    const dung = dungeons.find((d) => d.id === parseInt(dungId));
    const sufijo = char?.gender === 1 ? "añadida" : "añadido";
    toast.success(
      `${char?.char || "Personaje"} ${sufijo} a ${dung?.name || "mazmorra"}`,
    );
    loadData();
  }

  async function addDungeonTeamReward(dungId, teamMembers, stasis) {
    if (!teamMembers || teamMembers.length === 0) {
      toast.error("No hay personajes para añadir");
      return;
    }
    const inserts = teamMembers.map((char) => ({
      char: parseInt(char.id),
      dung: parseInt(dungId),
      stasis: parseInt(stasis),
    }));

    const { error } = await supabase.from("wakfurewards").insert(inserts);
    if (error) {
      toast.error("Error al añadir equipo: " + error.message);
      return;
    }
    const dung = dungeons.find((d) => d.id === parseInt(dungId));
    toast.success(`Equipo añadido a ${dung?.name || "mazmorra"}`);
    loadData();
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Cargando...</div>;
  }

  const tabContentClass = "flex flex-col flex-1 min-h-0 mt-0 gap-0";

  return (
    <Tabs
      defaultValue="recompensas"
      className="p-4 space-y-6 flex flex-col min-h-screen gap-0"
    >
      <header className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center justify-between sm:hidden">
          <h1 className="text-3xl font-bold">Capturadores de Sangre</h1>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-300 hover:text-white cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <h1 className="text-3xl font-bold">Capturadores de Sangre</h1>
          <div className="flex items-center gap-4">
            <TabsList variant="line">
              <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
              <TabsTrigger value="builds">Builds</TabsTrigger>
              <TabsTrigger value="guias">Guías</TabsTrigger>
              <TabsTrigger value="compra">Compra</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="hidden sm:flex flex-row items-center gap-4">
          <span className="text-sm text-gray-400">{countdown()}</span>
          <DailiesButton
            dailyDungeons={highlightedDungeonNames}
            moduloxDungeons={moduloxDungeonNames}
          />
          <button
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white px-4 py-1 rounded hover:cursor-pointer"
            onClick={resetRewards}
          >
            Resetear
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex sm:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/60 transition-opacity duration-200"
            style={{ animation: "fadeIn 150ms ease-out" }}
          />
          <nav
            onClick={(e) => e.stopPropagation()}
            className="relative ml-auto w-64 max-w-[75vw] h-full bg-[#0d2733] border-l border-gray-600 p-4 flex flex-col gap-8 overflow-y-auto"
            style={{ animation: "fadeIn 150ms ease-out" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Menú</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 my-6">
              <TabsList
                variant="line"
                className="flex-col items-stretch bg-transparent gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <TabsTrigger
                  value="recompensas"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Recompensas
                </TabsTrigger>
                <TabsTrigger
                  value="builds"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Builds
                </TabsTrigger>
                <TabsTrigger
                  value="guias"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Guías
                </TabsTrigger>
                <TabsTrigger
                  value="compra"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Compra
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm text-gray-400">{countdown()}</span>
              <DailiesButton
                dailyDungeons={highlightedDungeonNames}
                moduloxDungeons={moduloxDungeonNames}
              />
              <button
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white px-4 py-2 rounded hover:cursor-pointer text-sm w-fit"
                onClick={() => {
                  resetRewards();
                  setMenuOpen(false);
                }}
              >
                Resetear
              </button>
            </div>
          </nav>
        </div>
      )}

      <TabsContent value="recompensas" className={tabContentClass}>
        <RecompensasTab
          searchFilteredInactives={searchFilteredInactives}
          inactivePlayers={inactivePlayers}
          playerFilter={playerFilter}
          setPlayerFilter={setPlayerFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          availableRoles={availableRoles}
          searchCharacters={searchCharacters}
          setSearchCharacters={setSearchCharacters}
          dungeons={dungeons}
          dungRewardMap={dungRewardMap}
          charMap={charMap}
          rewardMap={rewardMap}
          dungeonFilter={dungeonFilter}
          setDungeonFilter={setDungeonFilter}
          addDungeonReward={addDungeonReward}
          deleteReward={deleteReward}
          updateStasis={updateStasis}
          addDungeonTeamReward={addDungeonTeamReward}
          handleOpenBuilder={handleOpenBuilder}
          highlightedDungeonNames={highlightedDungeonNames}
          moduloxDungeonNames={moduloxDungeonNames}
          sortedChars={sortedChars}
          totalStasis={totalStasis}
          togglePadreAusente={togglePadreAusente}
        />
      </TabsContent>

      <TabsContent value="builds" className={tabContentClass}>
        <BuildsTab />
      </TabsContent>

      <TabsContent value="guias" className={tabContentClass}>
        <GuiasTab />
      </TabsContent>

      <TabsContent value="compra" className={tabContentClass}>
        <CompraTab />
      </TabsContent>

      <footer className="border-t border-gray-700/40 pt-4 pb-2 text-center text-xs text-gray-500 space-y-1">
        <p>
          Este sitio no está afiliado a Ankama. Wakfu es una marca registrada de
          Ankama.
        </p>
        <p>Desarrollado por Visama &amp; Peballo</p>
        <p>v{pkg.version}</p>
      </footer>

      {builderDungeonId &&
        builderResult &&
        (() => {
          const dungeon = dungeons.find((d) => d.id === builderDungeonId);
          if (!dungeon) return null;
          const completedCharIds = new Set(
            (dungRewardMap[builderDungeonId] || []).map((r) => r.char),
          );
          const chars = sortedChars.filter(
            (c) =>
              !completedCharIds.has(c.id) && c.charrole !== "Padre Ausente",
          );
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
      <Toaster />
    </Tabs>
  );
}
