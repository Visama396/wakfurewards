import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import * as db from "@/lib/db";
import ClassIcon from "@/components/ClassIcon";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { extractItemInfo, parseItemStats, getStatIcon } from "@/lib/itemStats";
import TrashIcon from "@/components/TrashIcon";

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
  { key: "head", label: "Casco" },
  { key: "neck", label: "Amuleto" },
  { key: "chest", label: "Coraza" },
  { key: "back", label: "Capa" },
  { key: "shoulders", label: "Hombreras" },
  { key: "belt", label: "Cinturón" },
  { key: "legs", label: "Botas" },
  { key: "left_hand", label: "Anillo Izq." },
  { key: "right_hand", label: "Anillo Der." },
  { key: "first_weapon", label: "Secundaria" },
  { key: "second_weapon", label: "Principal" },
  { key: "accessory", label: "Emblema" },
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

/** Tooltip card shown on hover over equipped item icons */
function ItemTooltip({ item }) {
  const stats = processStats(parseItemStats(item.definition, item.level));
  return (
    <div className="bg-[#163544] rounded p-2 text-sm shadow-xl border border-gray-600 flex flex-col items-start justify-start pointer-events-none">
      <div className="flex gap-2 items-start">
        <div className="relative shrink-0">
          <img
            src={`${ITEM_ICON_BASE}${item.gfxId}.png`}
            alt=""
            className="size-12"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-gray-200 truncate font-medium block">
            {item.name}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <img
              src={`${RARITY_ICON_BASE}${item.rarity}.png`}
              alt=""
              className="h-4 w-auto"
            />
            <span className="text-gray-500 text-xs">Nv.{item.level}</span>
          </div>
        </div>
      </div>
      <div className="space-y-0.5 mt-1">
        {stats.map((s, i) =>
          s.type === "elemental_res" ? (
            <div
              key={i}
              className="flex items-center gap-1 text-xs leading-tight"
            >
              <img
                src={`${STAT_ICON_BASE}${s.singleElement ? ELEMENT_RES_ICON[s.elements[0].element] : "RES_IN_PERCENT"}.png`}
                alt=""
                className="size-4 shrink-0"
              />
              <span className="text-gray-200">
                {s.singleElement
                  ? `${s.elements[0].value} Resistencia ${s.elements[0].element}`
                  : `${s.elements[0].value} Resistencia`}
              </span>
              {!s.singleElement &&
                s.elements.map((e, j) => (
                  <img
                    key={j}
                    src={`${STAT_ICON_BASE}${ELEMENT_RES_ICON[e.element]}.png`}
                    alt=""
                    className="size-3.5"
                  />
                ))}
            </div>
          ) : (
            <div
              key={i}
              className={`flex items-center gap-1 ${s.className} text-xs leading-tight`}
            >
              {s.icon && (
                <img
                  src={`${STAT_ICON_BASE}${s.icon}.png`}
                  alt=""
                  className="size-4 shrink-0"
                />
              )}
              <span>{s.label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/** Individual build card display */
function BuildCard({ build, itemLookup }) {
  const socketsByEq = groupSocketsByEquipment(build.wakfubuild_sockets);

  const ROW_1 = ["head", "neck", "chest", "back", "shoulders", "belt", "legs"];
  const ROW_1_END = ["relic_sublimation"];
  const ROW_2 = [
    "left_hand",
    "right_hand",
    "first_weapon",
    "second_weapon",
    "accessory",
    "mount",
    "pet",
  ];
  const ROW_2_END = ["epic_sublimation"];

  function SlotIcon({ slotKey }) {
    let itemId = build[slotKey];
    let info = itemId ? itemLookup.get(itemId) : null;
    if (!info && slotKey === "first_weapon" && build["second_weapon"]) {
      const mainWeapon = itemLookup.get(build["second_weapon"]);
      if (mainWeapon && TWO_HANDED_TYPES.includes(mainWeapon.typeId)) {
        info = mainWeapon;
      }
    }
    const slotDef = EQUIPMENT_SLOTS.find((s) => s.key === slotKey);
    const icon = info ? (
      <img
        src={`${ITEM_ICON_BASE}${info.gfxId}.png`}
        alt={slotDef?.label || slotKey}
        className="size-8 object-contain"
        title={info.name}
      />
    ) : slotKey === "relic_sublimation" ? (
      <span className="size-8 flex items-center justify-center text-xs font-bold bg-[#0d2733] border border-gray-600 rounded text-gray-400 cursor-default" title="Reliquia">R</span>
    ) : slotKey === "epic_sublimation" ? (
      <span className="size-8 flex items-center justify-center text-xs font-bold bg-[#0d2733] border border-gray-600 rounded text-gray-400 cursor-default" title="Épica">E</span>
    ) : (
      <img
        src={`${ICON_BASE}${slotKey.toUpperCase()}.png`}
        alt={slotDef?.label || slotKey}
        className="size-8 object-contain"
        title={slotDef?.label || slotKey}
      />
    );
    return (
      <div className="relative">
        {info ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {icon}
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-0 border-0 bg-transparent shadow-none">
              <ItemTooltip item={info} />
            </TooltipContent>
          </Tooltip>
        ) : (
          icon
        )}
        {itemId && SOCKET_SLOTS.has(slotKey) && (
          <SocketBadges sockets={socketsByEq[slotKey]} />
        )}
      </div>
    );
  }

  function Row({ leftSlots, rightSlots }) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {leftSlots.map((k) => (
            <SlotIcon key={k} slotKey={k} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {rightSlots.map((k) => (
            <SlotIcon key={k} slotKey={k} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d2733]/80 rounded p-2 border border-gray-700/40 space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="bg-orange-400/20 text-orange-300 text-xs font-bold px-1.5 py-0.5 rounded">
          Nv.{build.level}
        </span>
        <span className="text-xs text-gray-500">
          {EQUIPMENT_SLOTS.filter((s) => build[s.key]).length}/16 piezas
        </span>
      </div>
      <TooltipProvider delayDuration={0}>
        <Row leftSlots={ROW_1} rightSlots={ROW_1_END} />
        <Row leftSlots={ROW_2} rightSlots={ROW_2_END} />
      </TooltipProvider>
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

const ICON_BASE =
  "https://raw.githubusercontent.com/Tmktahu/WakfuAssets/main/equipmentDefaults/";
const ITEM_ICON_BASE =
  "https://raw.githubusercontent.com/Vertylo/wakassets/main/items/";
const RARITY_ICON_BASE =
  "https://raw.githubusercontent.com/Tmktahu/WakfuAssets/main/rarities/";
const STAT_ICON_BASE =
  "https://raw.githubusercontent.com/Vertylo/wakassets/main/characteristics/";
const LEVEL_OPTIONS = [
  20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245,
];
const RARITY_FILTER = [3, 4, 5, 6, 7];

const HAS_ICON = new Set([
  "head",
  "neck",
  "chest",
  "back",
  "shoulders",
  "belt",
  "legs",
  "left_hand",
  "right_hand",
  "first_weapon",
  "second_weapon",
  "accessory",
  "mount",
  "pet",
]);

const WEAPON_TYPES = [
  101, 108, 110, 111, 112, 113, 114, 115, 117, 223, 253, 254, 537,
];
const TWO_HANDED_TYPES = [101, 111, 114, 117, 223, 253];
const SECOND_HAND_TYPES = [112, 189];

const ELEMENTAL_RES_IDS = new Set([82, 83, 84, 85, 90, 96, 97, 98]);

const ELEMENT_RES_ICON = {
  Fuego: "RES_FIRE_PERCENT",
  Agua: "RES_WATER_PERCENT",
  Tierra: "RES_EARTH_PERCENT",
  Aire: "RES_AIR_PERCENT",
};

function processStats(stats) {
  const res = [];
  const elems = [];

  for (const s of stats) {
    if (ELEMENTAL_RES_IDS.has(s.actionId) && s.element) {
      elems.push(s);
    } else {
      res.push({ type: "stat", ...s });
    }
  }

  if (elems.length > 0) {
    const allSame = elems.every((e) => e.value === elems[0].value);
    res.push({
      type: "elemental_res",
      elements: elems,
      allSameValue: allSame,
      singleElement: elems.length === 1,
    });
  }

  return res;
}

const SLOT_TYPE_IDS = {
  head: [134],
  neck: [120],
  chest: [136],
  back: [132],
  shoulders: [138],
  belt: [133],
  legs: [119],
  left_hand: [103],
  right_hand: [103],
  first_weapon: SECOND_HAND_TYPES,
  second_weapon: [101, 108, 110, 111, 113, 114, 115, 117, 223, 253, 254, 537],
  accessory: [646],
  mount: [611],
  pet: [582],
  relic_sublimation: [812],
  epic_sublimation: [812],
};

/** Creates default socket state for a socketable equipment slot */
function createDefaultSockets() {
  return Array.from({ length: 4 }, (_, i) => ({
    slot_index: i + 1,
    level: 0,
    color: "red",
  }));
}

/** Form drawer for creating a new build */
function BuildFormDrawer({ character, onAddBuild, onClose, allItems, recycleItemIds, onAddRecycleItem }) {
  const [level, setLevel] = useState(200);
  const [equipment, setEquipment] = useState({});
  const [equipmentGfx, setEquipmentGfx] = useState({});
  const [sockets, setSockets] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [search, setSearch] = useState("");
  const [errorSlots, setErrorSlots] = useState(new Set());

  const levelMin = useMemo(() => {
    const idx = LEVEL_OPTIONS.indexOf(level);
    return idx > 0 ? LEVEL_OPTIONS[idx - 1] + 1 : 0;
  }, [level]);

  const filteredItems = useMemo(() => {
    if (!search || !allItems.length || !selectedSlot) return [];
    const allowedTypes = SLOT_TYPE_IDS[selectedSlot];
    if (!allowedTypes) return [];
    const q = search.toLowerCase();
    return allItems
      .filter(
        (item) =>
          !recycleItemIds.has(item.id) &&
          (selectedSlot === "mount" ||
            selectedSlot === "pet" ||
            RARITY_FILTER.includes(item.rarity)) &&
          (selectedSlot === "mount" ||
            selectedSlot === "pet" ||
            selectedSlot === "relic_sublimation" ||
            selectedSlot === "epic_sublimation" ||
            (item.level >= levelMin && item.level <= level)) &&
          item.name.toLowerCase().includes(q) &&
          allowedTypes.includes(
            item.definition?.item?.baseParameters?.itemTypeId ?? item.typeId,
          ) &&
          (selectedSlot === "accessory"
            ? !item.hasState
            : selectedSlot === "relic_sublimation"
              ? item.sublimationParams?.isRelic === true
              : selectedSlot === "epic_sublimation"
                ? item.sublimationParams?.isEpic === true
                : true),
      )
      .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name))
      .slice(0, 50);
  }, [search, allItems, level, selectedSlot, recycleItemIds]);

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
    const errSlots = new Set();
    let errMsg = "";

    for (const [key, id] of Object.entries(equipment)) {
      if (!id) continue;
      if (key === "relic_sublimation" || key === "epic_sublimation") continue;
      const item = allItems.find((i) => i.id === id);
      if (!item) continue;

      if (item.rarity === 6) {
        for (const [k2, id2] of Object.entries(equipment)) {
          if (k2 === key || k2 === "relic_sublimation" || k2 === "epic_sublimation") continue;
          if (!id2) continue;
          const other = allItems.find((i) => i.id === id2);
          if (other?.rarity === 6) {
            errSlots.add(key);
            errSlots.add(k2);
            errMsg = "Solo se permite una reliquia por build";
          }
        }
      }

      if (item.rarity === 7) {
        for (const [k2, id2] of Object.entries(equipment)) {
          if (k2 === key || k2 === "relic_sublimation" || k2 === "epic_sublimation") continue;
          if (!id2) continue;
          const other = allItems.find((i) => i.id === id2);
          if (other?.rarity === 7) {
            errSlots.add(key);
            errSlots.add(k2);
            errMsg = "Solo se permite una épica por build";
          }
        }
      }

      if (item.typeId === 103) {
        const otherRing = key === "left_hand" ? "right_hand" : "left_hand";
        if (equipment[otherRing] === id) {
          errSlots.add(key);
          errSlots.add(otherRing);
          errMsg = "No se puede equipar el mismo anillo en ambas manos";
        }
      }
    }

    if (errSlots.size > 0) {
      setErrorSlots(errSlots);
      if (errMsg) toast.error(errMsg);
      return;
    }

    onAddBuild(character.id, level, equipment, sockets);
    onClose();
  }

  function handleSelectItem(item) {
    const errSlots = new Set();

    if (item.rarity === 6) {
      for (const [key, id] of Object.entries(equipment)) {
        if (key === selectedSlot || key === "relic_sublimation" || key === "epic_sublimation") continue;
        if (!id) continue;
        const existing = allItems.find((i) => i.id === id);
        if (existing?.rarity === 6) {
          errSlots.add(key);
          errSlots.add(selectedSlot);
        }
      }
    }

    if (item.rarity === 7) {
      for (const [key, id] of Object.entries(equipment)) {
        if (key === selectedSlot || key === "relic_sublimation" || key === "epic_sublimation") continue;
        if (!id) continue;
        const existing = allItems.find((i) => i.id === id);
        if (existing?.rarity === 7) {
          errSlots.add(key);
          errSlots.add(selectedSlot);
        }
      }
    }

    if (item.typeId === 103) {
      const otherRing =
        selectedSlot === "left_hand" ? "right_hand" : "left_hand";
      if (equipment[otherRing] === item.id) {
        errSlots.add(otherRing);
        errSlots.add(selectedSlot);
      }
    }

    if (errSlots.size > 0) {
      setErrorSlots(errSlots);
      return;
    }

    setErrorSlots(new Set());

    let eqUpdate = { ...equipment, [selectedSlot]: item.id };
    let gfxUpdate = { ...equipmentGfx, [selectedSlot]: item.gfxId };

    if (
      selectedSlot === "second_weapon" &&
      TWO_HANDED_TYPES.includes(item.typeId)
    ) {
      delete eqUpdate["first_weapon"];
      gfxUpdate["first_weapon"] = item.gfxId;
    } else if (selectedSlot === "second_weapon") {
      if (!equipment["first_weapon"]) {
        delete gfxUpdate["first_weapon"];
      }
    } else if (selectedSlot === "first_weapon") {
      const principalId = equipment["second_weapon"];
      if (principalId) {
        const principalItem = allItems.find((i) => i.id === principalId);
        if (principalItem && TWO_HANDED_TYPES.includes(principalItem.typeId)) {
          delete eqUpdate["second_weapon"];
          delete gfxUpdate["second_weapon"];
        }
      }
    }

    setEquipment(eqUpdate);
    setEquipmentGfx(gfxUpdate);
    setSearch("");
    if (SOCKET_SLOTS.has(selectedSlot) && !sockets[selectedSlot]) {
      setSockets((prev) => ({
        ...prev,
        [selectedSlot]: createDefaultSockets(),
      }));
    }
  }

  const activeSlot = EQUIPMENT_SLOTS.find((s) => s.key === selectedSlot);

  return (
    <Drawer open onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#0d2733] text-white border-gray-600 flex flex-col h-[65dvh] mt-0">
        <div className="flex items-center justify-between px-6 pt-6 pb-0 shrink-0">
          <DrawerTitle className="sr-only">
            Crear build para {character.char}
          </DrawerTitle>
          <h3 className="text-lg font-semibold text-orange-300">
            Crear build para {character.char}
          </h3>
          <DrawerClose className="text-gray-400 hover:text-white text-xl cursor-pointer leading-none">
            ×
          </DrawerClose>
        </div>

        <div className="flex flex-col min-h-0 flex-1 px-6 pb-6 pt-4 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-sm text-gray-400">Nivel:</label>
            <select
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="bg-[#0d2733] border border-gray-600 rounded text-sm py-1 px-2"
            >
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5 shrink-0">
            {EQUIPMENT_SLOTS.map((slot) => {
              const hasValue = !!equipment[slot.key];
              const isSelected = selectedSlot === slot.key;
              return (
                <button
                  key={slot.key}
                    onClick={() => {
                    setSelectedSlot(slot.key);
                    const item = allItems.find(
                      (i) => i.id === equipment[slot.key],
                    );
                    setSearch(item?.name || "");
                    setErrorSlots(new Set());
                  }}
                  title={slot.label}
                  className={`relative flex flex-col items-center gap-0.5 p-1 rounded cursor-pointer transition-colors ${
                    isSelected && !errorSlots.has(slot.key)
                      ? "bg-orange-400/20 ring-1 ring-orange-400"
                      : errorSlots.has(slot.key)
                        ? "bg-red-400/20 ring-1 ring-red-500"
                        : "hover:bg-white/5"
                  }`}
                >
                  {equipmentGfx[slot.key] ? (
                    <img
                      src={`${ITEM_ICON_BASE}${equipmentGfx[slot.key]}.png`}
                      alt={slot.label}
                      className="size-9"
                    />
                  ) : HAS_ICON.has(slot.key) ? (
                    <img
                      src={`${ICON_BASE}${slot.key.toUpperCase()}.png`}
                      alt={slot.label}
                      className="size-9"
                    />
                  ) : (
                    <span className="size-9 flex items-center justify-center text-xs font-bold bg-[#0d2733] border border-gray-600 rounded text-gray-400">
                      {slot.label[0]}
                    </span>
                  )}
                  {hasValue && (
                    <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-green-400" />
                  )}
                  <span className="text-[10px] text-gray-500 leading-tight">
                    {slot.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activeSlot && (
            <div className="border border-gray-700/60 rounded p-3 flex flex-col min-h-0 flex-1 gap-2">
              <label className="text-xs text-gray-400 font-medium shrink-0">
                {activeSlot.label}
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar objeto..."
                className="w-full bg-[#0d2733] border border-gray-600 rounded text-sm py-1.5 px-2 shrink-0"
              />
              {search && filteredItems.length > 0 && (
                <div className="min-h-0 flex-1 overflow-y-auto vertical-scroll border border-gray-700/60 rounded grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 p-1.5">
                  {filteredItems.map((item) => {
                    const stats = processStats(
                      parseItemStats(item.definition, item.level),
                    );
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className="w-full text-left p-2 text-sm hover:bg-white/10 bg-[#163544] cursor-pointer rounded transition-colors flex flex-col items-start justify-start"
                      >
                        <div className="flex gap-2 items-start w-full">
                          <div className="relative shrink-0">
                            <img
                              src={`${ITEM_ICON_BASE}${item.gfxId}.png`}
                              alt=""
                              className="size-12"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-1">
                              <span className="text-gray-200 truncate font-medium block flex-1">
                                {item.name}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddRecycleItem(item.id);
                                }}
                                className="text-red-400 hover:text-red-300 shrink-0 leading-none cursor-pointer"
                                title="Enviar a reciclaje"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <img
                                src={`${RARITY_ICON_BASE}${item.rarity}.png`}
                                alt=""
                                className="h-4 w-auto"
                              />
                              <span className="text-gray-500 text-xs">
                                Nv.{item.level}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-0.5 mt-1">
                          {stats.map((s, i) =>
                            s.type === "elemental_res" ? (
                              <div
                                key={i}
                                className="flex items-center gap-1 text-xs leading-tight"
                              >
                                <img
                                  src={`${STAT_ICON_BASE}${s.singleElement ? ELEMENT_RES_ICON[s.elements[0].element] : "RES_IN_PERCENT"}.png`}
                                  alt=""
                                  className="size-4 shrink-0"
                                />
                                <span className="text-gray-200">
                                  {s.singleElement
                                    ? `${s.elements[0].value} Resistencia ${s.elements[0].element}`
                                    : `${s.elements[0].value} Resistencia`}
                                </span>
                                {!s.singleElement &&
                                  s.elements.map((e, j) => (
                                    <img
                                      key={j}
                                      src={`${STAT_ICON_BASE}${ELEMENT_RES_ICON[e.element]}.png`}
                                      alt=""
                                      className="size-3.5"
                                    />
                                  ))}
                              </div>
                            ) : (
                              <div
                                key={i}
                                className={`flex items-center gap-1 ${s.className} text-xs leading-tight`}
                              >
                                {s.icon && (
                                  <img
                                    src={`${STAT_ICON_BASE}${s.icon}.png`}
                                    alt=""
                                    className="size-4 shrink-0"
                                  />
                                )}
                                <span>{s.label}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {SOCKET_SLOTS.has(activeSlot.key) &&
                equipment[activeSlot.key] && (
                  <div className="flex items-center gap-2 pt-1">
                    {(sockets[activeSlot.key] || createDefaultSockets()).map(
                      (sock, i) => (
                        <FormSocketRow
                          key={i}
                          equipment={activeSlot.key}
                          socketIndex={i}
                          socket={sock}
                          onChange={handleSocketChange}
                        />
                      ),
                    )}
                  </div>
                )}
            </div>
          )}

          <div className="flex justify-end pt-2 shrink-0">
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
export default function BuildsTab() {
  const [builds, setBuilds] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [recycleItemIds, setRecycleItemIds] = useState(new Set());
  const [creatingForChar, setCreatingForChar] = useState(null);
  const [recycleSearch, setRecycleSearch] = useState("");
  const allItems = useRef([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [b, c, ri] = await Promise.all([
        db.fetchBuilds(),
        db.fetchCharacters(),
        db.fetchRecycleIds(),
      ]);
      setBuilds(b);
      setCharacters(c);
      setRecycleItemIds(ri);
    }
    loadData();
    import("@/data/items.json").then((mod) => {
      allItems.current = mod.default.map(extractItemInfo);
      setItemsLoaded(true);
    });
  }, []);

  async function addBuild(characterId, level, equipment, socketsData) {
    try {
      await db.addBuild(characterId, level, equipment, socketsData);
      const newBuilds = await db.fetchBuilds();
      setBuilds(newBuilds);
      const char = characters.find((c) => c.id === parseInt(characterId));
      toast.success(`Build nivel ${level} creada para ${char?.char || "personaje"}`);
    } catch (e) {
      toast.error("Error al crear build: " + e.message);
    }
  }

  async function addRecycleItem(itemId) {
    try {
      await db.addRecycleItem(itemId);
      setRecycleItemIds((prev) => new Set(prev).add(parseInt(itemId)));
      toast.success("Ítem añadido a reciclaje");
    } catch (e) {
      toast.error("Error al añadir a reciclaje: " + e.message);
    }
  }

  async function removeRecycleItem(itemId) {
    try {
      await db.removeRecycleItem(itemId);
      setRecycleItemIds((prev) => {
        const next = new Set(prev);
        next.delete(parseInt(itemId));
        return next;
      });
      toast.success("Ítem eliminado de reciclaje");
    } catch (e) {
      toast.error("Error al eliminar de reciclaje: " + e.message);
    }
  }

  const recycleItems = useMemo(() => {
    if (!allItems.current.length || !recycleItemIds.size) return [];
    const items = allItems.current
      .filter((item) => recycleItemIds.has(item.id))
      .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
    if (!recycleSearch) return items;
    const q = recycleSearch.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [recycleItemIds, recycleSearch, itemsLoaded]);

  /** Mapa: character id → builds */
  const charBuildMap = {};
  for (const b of builds) {
    const cid = b.character;
    if (!charBuildMap[cid]) charBuildMap[cid] = [];
    charBuildMap[cid].push(b);
  }

  const itemLookup = useMemo(() => {
    const map = new Map();
    for (const item of allItems.current) {
      map.set(item.id, item);
    }
    return map;
  }, [itemsLoaded]);

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
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 items-start">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 flex-1 min-h-0 items-start content-start">
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
                    <p className="font-semibold text-sm truncate">
                      {char.char}
                    </p>
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
                      <BuildCard
                        key={build.id}
                        build={build}
                        itemLookup={itemLookup}
                      />
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

        <div className="w-full lg:w-60 shrink-0 lg:border-l border-gray-700/40 lg:pl-4 space-y-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Reciclaje
          </h4>
          <div className="space-y-1 max-h-80 overflow-y-auto vertical-scroll">
            {recycleItems.map((item) => {
              const stats = parseItemStats(item.definition, item.level);
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-2 text-xs group p-1.5 rounded hover:bg-white/5"
                >
                  <div className="relative shrink-0">
                    <img
                      src={`${ITEM_ICON_BASE}${item.gfxId}.png`}
                      alt=""
                      className="size-8"
                      loading="lazy"
                    />
                    <img
                      src={`${RARITY_ICON_BASE}${item.rarity}.png`}
                      alt=""
                      className="absolute -top-0.5 -left-0.5 h-3 w-auto"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-gray-200 text-sm">
                        {item.name}
                      </span>
                      <span className="text-gray-600 shrink-0">
                        Nv.{item.level}
                      </span>
                    </div>
                    {stats.length > 0 && (
                      <div className="space-y-0.5 mt-1">
                        {stats.slice(0, 3).map((s, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-1 ${s.className} text-[11px] leading-tight`}
                          >
                            {s.icon && (
                              <img
                                src={`${STAT_ICON_BASE}${s.icon}.png`}
                                alt=""
                                className="size-3 shrink-0"
                              />
                            )}
                            <span>{s.label}</span>
                          </div>
                        ))}
                        {stats.length > 3 && (
                          <span className="text-gray-600 text-[11px]">
                            +{stats.length - 3} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeRecycleItem(item.id)}
                    className="text-gray-600 hover:text-red-400 shrink-0 cursor-pointer leading-none"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {recycleItems.length === 0 && (
              <p className="text-xs text-gray-600 italic">
                {recycleSearch ? "Sin resultados" : "Sin ítems"}
              </p>
            )}
          </div>
          <input
            type="text"
            value={recycleSearch}
            onChange={(e) => setRecycleSearch(e.target.value)}
            placeholder="Buscar item"
            className="w-full bg-[#0d2733] border border-gray-600 rounded text-xs py-1 px-2"
          />
        </div>
      </div>

      {creatingForChar && (
        <BuildFormDrawer
          character={creatingForChar}
          onAddBuild={addBuild}
          onClose={() => setCreatingForChar(null)}
          allItems={allItems.current}
          recycleItemIds={recycleItemIds}
          onAddRecycleItem={addRecycleItem}
        />
      )}
    </>
  );
}
