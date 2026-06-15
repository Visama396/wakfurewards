import { useState } from "react";
import ClassIcon from "@/components/ClassIcon";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";

const SOCKET_COLORS = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  white: "bg-gray-100",
};

/** Equipment slots that can have sockets */
const SOCKET_SLOTS = new Set([
  "head",
  "neck",
  "chest",
  "left_hand",
  "legs",
  "back",
  "shoulders",
  "belt",
  "right_hand",
  "first_weapon",
]);

/** All equipment slots display order and labels */
const EQUIPMENT_SLOTS = [
  { key: "head", label: "Cabeza" },
  { key: "neck", label: "Cuello" },
  { key: "chest", label: "Pecho" },
  { key: "back", label: "Espalda" },
  { key: "shoulders", label: "Hombros" },
  { key: "belt", label: "Cinturón" },
  { key: "legs", label: "Piernas" },
  { key: "left_hand", label: "Mano Izq." },
  { key: "right_hand", label: "Mano Der." },
  { key: "first_weapon", label: "Arma 1" },
  { key: "second_weapon", label: "Arma 2" },
  { key: "accessory", label: "Accesorio" },
  { key: "mount", label: "Montura" },
  { key: "pet", label: "Mascota" },
  { key: "relic_sublimation", label: "Reliquia" },
  { key: "epic_sublimation", label: "Épica" },
];

/** Groups sockets by equipment for quick lookup */
function groupSocketsByEquipment(sockets = []) {
  const map = {};
  for (const s of sockets) {
    if (!map[s.equipment]) map[s.equipment] = [];
    map[s.equipment].push(s);
  }
  return map;
}

/** Displays socket dots with level */
function SocketBadges({ sockets }) {
  if (!sockets || sockets.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {sockets
        .sort((a, b) => a.slot_index - b.slot_index)
        .map((s) => (
          <span
            key={s.slot_index}
            className={`inline-flex items-center justify-center size-4 rounded-full text-[8px] font-bold text-black ${SOCKET_COLORS[s.color] || "bg-gray-500"}`}
            title={`Socket ${s.slot_index}: ${s.color} nivel ${s.level}`}
          >
            {s.level > 9 ? "X" : s.level}
          </span>
        ))}
    </span>
  );
}

/** Single equipment row in a build card */
function EquipmentRow({ slot, itemName, sockets }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-gray-500 w-16 shrink-0">{slot.label}:</span>
      <span
        className={`truncate ${itemName ? "text-gray-200" : "text-gray-600 italic"}`}
      >
        {itemName || "—"}
      </span>
      {itemName && SOCKET_SLOTS.has(slot.key) && (
        <SocketBadges sockets={sockets} />
      )}
    </div>
  );
}

/** Individual build card display */
function BuildCard({ build }) {
  const socketsByEq = groupSocketsByEquipment(build.wakfubuild_sockets);

  return (
    <div className="bg-[#0d2733]/80 rounded p-2.5 space-y-1 border border-gray-700/40">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="bg-orange-400/20 text-orange-300 text-xs font-bold px-1.5 py-0.5 rounded">
          Nv.{build.level}
        </span>
        <span className="text-xs text-gray-500">
          {EQUIPMENT_SLOTS.filter((s) => build[s.key]).length}/16 piezas
        </span>
      </div>
      <div className="space-y-0.5">
        {EQUIPMENT_SLOTS.map((slot) => (
          <EquipmentRow
            key={slot.key}
            slot={slot}
            itemName={build[slot.key]}
            sockets={socketsByEq[slot.key]}
          />
        ))}
      </div>
    </div>
  );
}

/** Inline socket controls inside the form */
function FormSocketRow({ equipment, socketIndex, socket, onChange }) {
  return (
    <div className="flex items-center gap-1 text-[10px]">
      <span className="text-gray-500 w-3">{socketIndex + 1}</span>
      <select
        value={socket.color}
        onChange={(e) =>
          onChange(equipment, socketIndex, { ...socket, color: e.target.value })
        }
        className="bg-[#0d2733] border border-gray-600 rounded text-[10px] py-0.5 px-1 w-14"
      >
        <option value="red">Rojo</option>
        <option value="green">Verde</option>
        <option value="blue">Azul</option>
        <option value="white">Blanco</option>
      </select>
      <input
        type="number"
        min={0}
        max={11}
        value={socket.level || 0}
        onChange={(e) =>
          onChange(equipment, socketIndex, {
            ...socket,
            level: Math.min(11, Math.max(0, parseInt(e.target.value) || 0)),
          })
        }
        className="w-10 bg-[#0d2733] border border-gray-600 rounded text-[10px] py-0.5 px-1 text-center"
      />
    </div>
  );
}

/** Creates default socket state for a socketable equipment slot */
function createDefaultSockets() {
  return Array.from({ length: 4 }, (_, i) => ({
    slot_index: i + 1,
    level: 0,
    color: "red",
  }));
}

/** Form drawer for creating a new build */
function BuildFormDrawer({ character, onAddBuild, onClose }) {
  const [level, setLevel] = useState(200);
  const [equipment, setEquipment] = useState({});
  const [sockets, setSockets] = useState({});

  function handleEqChange(key, value) {
    setEquipment((prev) => ({ ...prev, [key]: value }));
    if (value && SOCKET_SLOTS.has(key) && !sockets[key]) {
      setSockets((prev) => ({ ...prev, [key]: createDefaultSockets() }));
    }
  }

  function handleSocketChange(eq, idx, updated) {
    setSockets((prev) => {
      const slots = [...(prev[eq] || createDefaultSockets())];
      slots[idx] = updated;
      return { ...prev, [eq]: slots };
    });
  }

  function handleSubmit() {
    onAddBuild(character.id, level, equipment, sockets);
    onClose();
  }

  return (
    <Drawer open onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#0d2733] text-white border-gray-600 flex flex-col max-h-[85dvh] mt-0">
        <div className="flex items-center justify-between px-6 pt-6 pb-0 shrink-0">
          <h3 className="text-lg font-semibold text-orange-300">
            Crear build para {character.char}
          </h3>
          <DrawerClose className="text-gray-400 hover:text-white text-xl cursor-pointer leading-none">
            ×
          </DrawerClose>
        </div>

        <div className="overflow-y-auto vertical-scroll min-h-0 flex-1 px-6 pb-6 pt-4 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Nivel:</label>
            <input
              type="number"
              min={1}
              max={230}
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
              className="w-20 bg-[#0d2733] border border-gray-600 rounded text-center text-sm py-1"
            />
          </div>

          {EQUIPMENT_SLOTS.map((slot) => {
            const val = equipment[slot.key] || "";
            const showSockets = SOCKET_SLOTS.has(slot.key) && val;
            const socketSlots = sockets[slot.key] || createDefaultSockets();

            return (
              <div key={slot.key}>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400 w-16 shrink-0">
                    {slot.label}:
                  </label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleEqChange(slot.key, e.target.value)}
                    placeholder="Nombre del objeto"
                    className="flex-1 bg-[#0d2733] border border-gray-600 rounded text-sm py-1 px-2"
                  />
                </div>
                {showSockets && (
                  <div className="flex items-center gap-2 mt-1 ml-[4.5rem]">
                    {socketSlots.map((sock, i) => (
                      <FormSocketRow
                        key={i}
                        equipment={slot.key}
                        socketIndex={i}
                        socket={sock}
                        onChange={handleSocketChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm bg-orange-400 hover:bg-orange-300 rounded font-medium text-black cursor-pointer"
            >
              Guardar build
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Pestaña de builds.
 * Muestra personajes en tarjetas con sus builds listadas dentro.
 */
export default function BuildsTab({
  builds = [],
  characters = [],
  onAddBuild,
}) {
  const [creatingForChar, setCreatingForChar] = useState(null);

  /** Mapa: character id → builds */
  const charBuildMap = {};
  for (const b of builds) {
    const cid = b.character;
    if (!charBuildMap[cid]) charBuildMap[cid] = [];
    charBuildMap[cid].push(b);
  }

  /** Orden personalizado: Peballo > Juanio > Visama, luego alfabético por jugador, luego por personaje */
  const PLAYER_ORDER = ["Peballo", "Juanio", "Visama"];
  const activeChars = characters
    .filter((c) => c.charrole !== "Padre Ausente")
    .sort((a, b) => {
      const ai = PLAYER_ORDER.indexOf(a.player);
      const bi = PLAYER_ORDER.indexOf(b.player);
      if (ai !== -1 && bi !== -1 && ai !== bi) return ai - bi;
      if (ai !== -1 && bi === -1) return -1;
      if (ai === -1 && bi !== -1) return 1;
      if (a.player !== b.player) return a.player.localeCompare(b.player);
      return a.char.localeCompare(b.char);
    });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 items-start content-start">
        {activeChars.map((char) => {
          const charBuilds = charBuildMap[char.id];
          return (
            <div
              key={char.id}
              className="bg-[#163544] rounded-lg p-3 shrink-0 min-w-80 flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <ClassIcon cls={char.class} gender={char.gender} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{char.char}</p>
                  <p className="text-xs text-gray-400">
                    {char.class} · {charBuilds ? charBuilds.length : 0} build
                    {charBuilds?.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setCreatingForChar(char)}
                  className="shrink-0 text-xs bg-orange-400 hover:bg-orange-300 rounded px-2 py-1 cursor-pointer font-medium text-black"
                >
                  + Build
                </button>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto vertical-scroll min-h-0 pr-1">
                {charBuilds ? (
                  charBuilds.map((build) => (
                    <BuildCard key={build.id} build={build} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No hay builds registradas
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {creatingForChar && (
        <BuildFormDrawer
          character={creatingForChar}
          onAddBuild={onAddBuild}
          onClose={() => setCreatingForChar(null)}
        />
      )}
    </>
  );
}
