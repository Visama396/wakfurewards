import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const ROLE_BADGES = {
  CaC: "bg-red-700",
  DaD: "bg-blue-700",
  Support: "bg-green-700",
  xD: "bg-purple-700",
  "Padre Ausente": "bg-gray-600",
};

const CLASS_ICONS = {
  feca: 1,
  osa: 2,
  anu: 3,
  sram: 4,
  xelor: 5,
  zurka: 6,
  eni: 7,
  yop: 8,
  ocra: 9,
  sadida: 10,
  sacro: 11,
  panda: 12,
  tyma: 13,
  zobal: 14,
  ugi: 15,
  steamer: 16,
  selo: 18,
  hiper: 19,
};

const DUNGEON_ICONS = {
  Tejaroxores: "/cojonidas.webp",
};

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

  useEffect(() => {
    loadData();
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

  async function deleteReward(id) {
    await supabase.from("wakfurewards").delete().eq("id", id);
    loadData();
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

  const rewardMap = {};
  rewards.forEach((r) => {
    if (!rewardMap[r.char]) rewardMap[r.char] = [];
    rewardMap[r.char].push(r);
  });

  const charMap = {};
  characters.forEach((c) => {
    charMap[c.id] = c;
  });

  const dungMap = {};
  dungeons.forEach((d) => {
    dungMap[d.id] = d;
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

  const actives = sortedChars.filter(
    (c) => rewardMap[c.id] && rewardMap[c.id].length > 0,
  );

  const padres = sortedChars.filter((c) => c.charrole === "Padre Ausente");

  const totalStasis = rewards.reduce((s, r) => s + r.stasis, 0);

  function ClassIcon({ cls }) {
    const num = CLASS_ICONS[cls];
    if (!num)
      return (
        <span className="w-5 h-5 inline-block rounded bg-gray-700 align-middle" />
      );
    return (
      <img
        src={`https://zenithwakfu.com/images/breeds/icons/${num}.webp`}
        alt={cls}
        className="size-6 inline-block rounded align-middle"
      />
    );
  }

  function DungeonIcon({ name }) {
    const src = DUNGEON_ICONS[name];
    if (!src)
      return (
        <span className="size-6 inline-block rounded bg-gray-700 align-middle" />
      );
    return (
      <img
        src={src}
        alt={name}
        className="size-8 inline-block rounded align-middle"
      />
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recompensas Fin de Mes</h1>
        <div className="text-right">
          <span className="text-2xl font-bold text-yellow-400">
            {totalStasis}
          </span>
          <span className="text-lg text-gray-400 ml-1">cofres</span>
        </div>
      </header>

      <section className="bg-[#0d2733] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-orange-300">
            Pendientes ({filteredInactives.length})
          </h2>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setPlayerFilter(null)}
              className={`text-xs px-2 py-0.5 rounded ${!playerFilter ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"}`}
            >
              Todos
            </button>
            {inactivePlayers.map((p) => (
              <button
                key={p}
                onClick={() => setPlayerFilter(p)}
                className={`text-xs px-2 py-0.5 rounded ${playerFilter === p ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {filteredInactives.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {playerFilter
              ? `${playerFilter} no tiene personajes pendientes`
              : "Todos han completado al menos una mazmorra este mes"}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredInactives.map((c) => (
              <div
                key={c.id}
                className="bg-[#163544] rounded px-3 py-2 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate flex items-center gap-1">
                    <ClassIcon cls={c.class} />
                    {c.char}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>{c.class}</span>
                    <span
                      className={`px-1.5 rounded text-white text-[10px] ${ROLE_BADGES[c.charrole] || "bg-gray-500"}`}
                    >
                      {c.charrole}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAddChar(String(c.id));
                    setAddDung("");
                    setShowAdd(true);
                  }}
                  className="shrink-0 text-xs bg-blue-600 hover:bg-blue-500 rounded px-2 py-1"
                >
                  +Añadir
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#0d2733] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-300 mb-3">
          Completados ({actives.length})
        </h2>
        <div className="space-y-4">
          {actives.map((c) => {
            const charRewards = rewardMap[c.id] || [];
            const charTotal = charRewards.reduce((s, r) => s + r.stasis, 0);
            return (
              <div key={c.id} className="bg-[#163544] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold flex items-center gap-1">
                      <ClassIcon cls={c.class} />
                      {c.char}
                    </span>
                    <span
                      className={`text-xs text-white px-2 py-0.5 rounded ${ROLE_BADGES[c.charrole] || "bg-gray-500"}`}
                    >
                      {c.charrole}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold">
                      {charTotal}
                    </span>
                    <button
                      onClick={() => {
                        setAddChar(String(c.id));
                        setAddDung("");
                        setShowAdd(true);
                      }}
                      className="text-xs bg-blue-600 hover:bg-blue-500 rounded px-2 py-1"
                    >
                      +Añadir
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase border-b border-gray-600">
                        <th className="text-left py-1 pr-2">Mazmorra</th>
                        <th className="text-center py-1 px-2 w-20">Stasis</th>
                        <th className="text-right py-1 pl-2 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {charRewards.map((r) => (
                        <tr key={r.id} className="border-b border-gray-700/50">
                          <td className="flex gap-2 items-center py-1.5 pr-2">
                            <DungeonIcon name={dungMap[r.dung]?.name} />
                            {dungMap[r.dung]?.name || `#${r.dung}`}
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <input
                              type="number"
                              min="1"
                              max="15"
                              defaultValue={r.stasis}
                              onBlur={(e) => {
                                const v = parseInt(e.target.value);
                                if (v !== r.stasis) updateStasis(r.id, v);
                              }}
                              className="w-14 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-0.5"
                            />
                          </td>
                          <td className="py-1.5 pl-2 text-right">
                            <button
                              onClick={() => deleteReward(r.id)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {padres.length > 0 && (
        <section className="bg-[#0d2733] rounded-lg p-4 opacity-60">
          <h2 className="text-lg font-semibold text-gray-400 mb-2">
            Padre Ausente ({padres.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {padres.map((c) => (
              <span
                key={c.id}
                className="text-sm text-gray-400 flex items-center gap-1"
              >
                <ClassIcon cls={c.class} />
                {c.char} ({c.class})
              </span>
            ))}
          </div>
        </section>
      )}

      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowAdd(false)}
        >
          <form
            onSubmit={addReward}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0d2733] rounded-lg p-6 w-full max-w-md space-y-4 border border-gray-600"
          >
            <h3 className="text-lg font-semibold">Nueva recompensa</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Personaje
              </label>
              <select
                value={addChar}
                onChange={(e) => setAddChar(e.target.value)}
                required
                className="w-full bg-[#163544] border border-gray-600 rounded px-3 py-2 text-sm"
              >
                <option value="">Seleccionar...</option>
                {sortedChars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.char} — {c.class} ({c.charrole}) [{c.player}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Mazmorra
              </label>
              <select
                value={addDung}
                onChange={(e) => setAddDung(e.target.value)}
                required
                className="w-full bg-[#163544] border border-gray-600 rounded px-3 py-2 text-sm"
              >
                <option value="">Seleccionar...</option>
                {dungeons.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Stasis</label>
              <input
                type="number"
                min="1"
                max="15"
                value={addStasis}
                onChange={(e) => setAddStasis(parseInt(e.target.value) || 1)}
                required
                className="w-full bg-[#163544] border border-gray-600 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded font-medium"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => {
          setAddChar("");
          setAddDung("");
          setShowAdd(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg"
      >
        +
      </button>
    </div>
  );
}
