/**
 * Build system constants and utility functions.
 * Shared between BuildCard and BuildFormDrawer in BuildsTab.jsx.
 */

/** Maps socket color to Tailwind background class */
export const SOCKET_COLORS = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  white: "bg-gray-100",
};

/** Equipment slots that can have sockets */
export const SOCKET_SLOTS = new Set([
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
export const EQUIPMENT_SLOTS = [
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

/** Slots that have a default icon in the CDN */
export const HAS_ICON = new Set([
  "head", "neck", "chest", "back", "shoulders", "belt", "legs",
  "left_hand", "right_hand", "first_weapon", "second_weapon",
  "accessory", "mount", "pet",
]);

/** Weapon type IDs */
export const WEAPON_TYPES = [
  101, 108, 110, 111, 112, 113, 114, 115, 117, 223, 253, 254, 537,
];

/** Two-handed weapon type IDs (override the second_weapon slot) */
export const TWO_HANDED_TYPES = [101, 111, 114, 117, 223, 253];

/** Off-hand weapon type IDs */
export const SECOND_HAND_TYPES = [112, 189];

/** Elemental resistance action IDs */
export const ELEMENTAL_RES_IDS = new Set([82, 83, 84, 85, 90, 96, 97, 98]);

/** Maps element name → resistance icon filename */
export const ELEMENT_RES_ICON = {
  Fuego: "RES_FIRE_PERCENT",
  Agua: "RES_WATER_PERCENT",
  Tierra: "RES_EARTH_PERCENT",
  Aire: "RES_AIR_PERCENT",
};

/** Level step options for build level selector */
export const LEVEL_OPTIONS = [
  20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245,
];

/** Rarity filter: only show items with these rarities (default excludes Mythical) */
export const RARITY_FILTER = [4, 5, 6, 7];

/** Maps item typeIds to their CDN icon filenames */
export function getItemTypeIcon(typeId) {
  if (TWO_HANDED_TYPES.includes(typeId)) return 519;
  if (typeId === 112 || typeId === 189) return 520;
  if (WEAPON_TYPES.includes(typeId)) return 518;
  return typeId;
}

/**
 * Stat filters for the build item search.
 * Each filter matches equip effect actionIds to find items that grant
 * a specific stat.
 */
export const STAT_FILTERS = [
  { id: "pa", label: "PA", icon: "AP", actionIds: [31] },
  { id: "pm", label: "PM", icon: "MP", actionIds: [41] },
  { id: "pw", label: "PW", icon: "WP", actionIds: [191] },
  { id: "alcance", label: "Alcance", icon: "RANGE", actionIds: [160] },
  { id: "crit_chance", label: "% Crítico", icon: "CRITICAL_BONUS", actionIds: [150] },
  { id: "anticipacion", label: "% Anticipación", icon: "BLOCK", actionIds: [875] },
  { id: "melee", label: "Melé", icon: "MELEE_DMG", actionIds: [1052] },
  { id: "distancia", label: "Distancia", icon: "RANGED_DMG", actionIds: [1053] },
  { id: "crit_dmg", label: "Dom. Crítico", icon: "CRITICAL_BONUS", actionIds: [149] },
  { id: "berserker", label: "Berserker", icon: "BERSERK_DMG", actionIds: [1055] },
  { id: "espalda", label: "Espalda", icon: "BACKSTAB_BONUS", actionIds: [180] },
  { id: "dom_elemental", label: "Dom. Elemental", icon: "DMG_IN_PERCENT", actionIds: [120, 1068] },
];

/** Maps character allocation stat keys to their stat icon filenames */
export const CHAR_STAT_ICON = {
  hpPercent: "HP",
  resistElemental: "RES_IN_PERCENT",
  barrera: "ARMOR",
  curaPercent: "HEAL_IN_PERCENT",
  vidaArmadura: "ARMOR",
  domElemental: "DMG_IN_PERCENT",
  domMelee: "MELEE_DMG",
  domDistancia: "RANGED_DMG",
  pv: "HP",
  placaje: "TACKLE",
  esquiva: "DODGE",
  iniciativa: "INIT",
  placajeEsquiva: "DODGE",
  voluntad: "WILLPOWER",
  critPercent: "CRITICAL_BONUS",
  anticipacionPercent: "DODGE",
  domCritico: "CRITICAL_BONUS",
  domEspalda: "BACKSTAB_BONUS",
  domBerserker: "BERSERK_DMG",
  domCuras: "HEAL_IN_PERCENT",
  resistEspalda: "RES_BACKSTAB",
  resistCritica: "CRITICAL_RES",
  pa: "AP",
  pmDmg: "MP",
  rangeDmg: "RANGE",
  pw2: "WP",
  armorGiven: "ARMOR",
  dmgPercent: "DMG_IN_PERCENT",
  resistPercent: "RES_IN_PERCENT",
  healPercent: "HEAL_IN_PERCENT",
  indirectDmg: "AOE_DMG",
};

/** Canonical actionId → display sort order (lower = first) */
export const SORT_ORDER = {
  20: 1, 31: 2, 41: 3, 191: 4, 192: 4,
  160: 5, 161: 5, 175: 6, 176: 6, 173: 7, 174: 7, 150: 8, 168: 8, 875: 9, 876: 9,
  120: 10, 130: 10, 1068: 10,
  1052: 11, 1059: 11, 1053: 12, 1060: 12, 149: 13, 1056: 13, 1055: 14, 1061: 14,
  180: 15, 181: 15, 26: 16,
  80: 17, 90: 17, 100: 17, 1069: 17,
  988: 18, 1062: 18, 71: 19, 1063: 19,
};

/** Maps equipment slot keys to the item typeIds that can go in them */
export const SLOT_TYPE_IDS = {
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
  pet: [582, 849],
  relic_sublimation: [812],
  epic_sublimation: [812],
};

/** Action ID sets used for stat classification in build previews */
export const CORE_ACTIONS = new Set([20, 31, 41, 191, 192]);
export const MASTERY_IDS = new Set([122, 124, 123, 125]);
export const RES_IDS = new Set([82, 83, 84, 85]);
export const COMBAT_IDS = new Set([150, 171, 166, 177, 175, 875, 160, 173, 162]);
export const SECONDARY_IDS = new Set([26, 71, 149, 180, 181, 988, 1052, 1053, 1055, 1056, 1059, 1060, 1061, 1062, 1063]);

/** Groups sockets by equipment slot for quick lookup */
export function groupSocketsByEquipment(sockets = []) {
  const map = {};
  for (const s of sockets) {
    if (!map[s.equipment]) map[s.equipment] = [];
    map[s.equipment].push(s);
  }
  return map;
}

/** Creates default socket state for a socketable equipment slot (4 empty red sockets) */
export function createDefaultSockets() {
  return Array.from({ length: 4 }, (_, i) => ({
    slot_index: i + 1,
    level: 0,
    color: "red",
  }));
}

/** Returns sort key for a stat entry (lower = displayed first) */
export function statSortKey(s) {
  if (s.type === "elemental_res") return 50;
  return SORT_ORDER[s.actionId] ?? 99;
}

/**
 * Groups elemental resistance stats into a single row when all
 * elements have the same value. When values differ, each element
 * is shown separately.
 */
export function processStats(stats) {
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
    if (allSame) {
      res.push({
        type: "elemental_res",
        elements: elems,
        allSameValue: true,
        singleElement: elems.length === 1,
      });
    } else {
      for (const e of elems) {
        res.push({ type: "stat", ...e });
      }
    }
  }

  return res;
}
