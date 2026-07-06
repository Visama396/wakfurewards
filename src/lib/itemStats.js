import statesData from "@/data/states.json";

// Maps item action IDs to icon filenames for stat display.
// Gain and loss variants of the same stat share an icon.
const STAT_ICON_MAP = {
  20:  "HP",
  26:  "HEAL_IN_PERCENT",
  31:  "AP",
  41:  "MP",
  71:  "RES_BACKSTAB",
  80:  "RES_IN_PERCENT",
  82:  "RES_FIRE_PERCENT",
  83:  "RES_WATER_PERCENT",
  84:  "RES_EARTH_PERCENT",
  85:  "RES_AIR_PERCENT",
  90:  "RES_IN_PERCENT",
  96:  "RES_EARTH_PERCENT",
  97:  "RES_FIRE_PERCENT",
  98:  "RES_WATER_PERCENT",
  100: "RES_IN_PERCENT",
  120: "DMG_IN_PERCENT",
  122: "DMG_FIRE_PERCENT",
  123: "DMG_EARTH_PERCENT",
  124: "DMG_WATER_PERCENT",
  125: "DMG_AIR_PERCENT",
  130: "DMG_IN_PERCENT",
  132: "DMG_FIRE_PERCENT",
  149: "CRITICAL_BONUS",
  150: "CRITICAL_BONUS",
  160: "RANGE",
  161: "RANGE",
  162: "PROSPECTION",
  166: "WISDOM",
  168: "CRITICAL_BONUS",
  171: "INIT",
  172: "INIT",
  173: "TACKLE",
  174: "TACKLE",
  175: "DODGE",
  176: "DODGE",
  177: "WILLPOWER",
  180: "BACKSTAB_BONUS",
  181: "BACKSTAB_BONUS",
  184: "BLOCK",
  191: "WP",
  192: "WP",
  875: "BLOCK",
  876: "DODGE",
  988: "CRITICAL_RES",
  1050: "AOE_DMG",
  1051: "SINGLE_TARGET_DMG",
  1052: "MELEE_DMG",
  1053: "RANGED_DMG",
  1055: "BERSERK_DMG",
  1056: "CRITICAL_BONUS",
  1060: "RANGED_DMG",
  1061: "BERSERK_DMG",
  1062: "CRITICAL_RES",
  1063: "RES_BACKSTAB",
  1068: "DMG_IN_PERCENT",
  1069: "RES_IN_PERCENT",
  2001: "PROSPECTION",
};

export function getStatIcon(actionId) {
  return STAT_ICON_MAP[actionId] || null;
}

const ELEMENT_NAMES = {
  el1: "Fuego",
  el2: "Agua",
  el3: "Tierra",
  el4: "Aire",
};

export const ELEMENT_COLORS = {
  Fuego: "text-orange-400",
  Agua: "text-blue-400",
  Aire: "text-fuchsia-400",
  Tierra: "text-green-500",
};

export const ALL_ELEMENTS = ["Fuego", "Agua", "Tierra", "Aire"];

const ELEMENT_TO_EL = {
  Fuego: "el1",
  Agua: "el2",
  Tierra: "el3",
  Aire: "el4",
};

const ELEMENT_TO_MASTERY_ID = {
  Fuego: 122,
  Agua: 124,
  Tierra: 123,
  Aire: 125,
};

const ELEMENT_TO_RESIST_ID = {
  Fuego: 82,
  Agua: 83,
  Tierra: 84,
  Aire: 85,
};

const ACTION_META = {
  20:  { tpl: "[#1] PdV", el: null },
  26:  { tpl: "[#1] Dominio Cura", el: null },
  31:  { tpl: "[#1] PA", el: null },
  41:  { tpl: "[#1] PM", el: null },
  71:  { tpl: "[#1] Resistencia por la Espalda", el: null },
  80:  { tpl: "[#1] Resistencia Elemental", el: null },
  82:  { tpl: "[#1] Resistencia al [el1]", el: "el1" },
  83:  { tpl: "[#1] Resistencia al [el2]", el: "el2" },
  84:  { tpl: "[#1] Resistencia a la [el3]", el: "el3" },
  85:  { tpl: "[#1] Resistencia al [el4]", el: "el4" },
   90:  { tpl: "-[#1] Resistencia Elemental", el: null },
   96:  { tpl: "-[#1] Resistencia a la [el3]", el: "el3" },
   97:  { tpl: "-[#1] Resistencia al [el1]", el: "el1" },
   98:  { tpl: "-[#1] Resistencia al [el2]", el: "el2" },
   100: { tpl: "-[#1] Resistencia Elemental", el: null },
  120: { tpl: "[#1] Dominio Elemental", el: null },
  122: { tpl: "[#1] Dominio [el1]", el: "el1" },
  123: { tpl: "[#1] Dominio [el3]", el: "el3" },
  124: { tpl: "[#1] Dominio [el2]", el: "el2" },
  125: { tpl: "[#1] Dominio [el4]", el: "el4" },
   130: { tpl: "-[#1] Dominio Elemental", el: null },
   132: { tpl: "-[#1] Dominio [el1]", el: "el1" },
  149: { tpl: "[#1] Dominio Crítico", el: null },
  150: { tpl: "[#1]% Golpe Crítico", el: null },
  160: { tpl: "[#1] Alcance", el: null },
  161: { tpl: "-[#1] Alcance", el: null },
  162: { tpl: "[#1] Prospección", el: null },
  166: { tpl: "[#1] Sabiduría", el: null },
   168: { tpl: "-[#1]% Golpe Crítico", el: null },
  171: { tpl: "[#1] Iniciativa", el: null },
   172: { tpl: "-[#1] Iniciativa", el: null },
  173: { tpl: "[#1] Placaje", el: null },
   174: { tpl: "-[#1] Placaje", el: null },
  175: { tpl: "[#1] Esquiva", el: null },
   176: { tpl: "-[#1] Esquiva", el: null },
  177: { tpl: "[#1] Voluntad", el: null },
  180: { tpl: "[#1] Dominio Espalda", el: null },
   181: { tpl: "-[#1] Dominio Espalda", el: null },
  184: { tpl: "[#1] Control", el: null },
  191: { tpl: "[#1] PW", el: null },
   192: { tpl: "-[#1] PW máx.", el: null },
  400: null,
  875: { tpl: "[#1]% Anticipación", el: null },
   876: { tpl: "-[#1]% Anticipación", el: null },
  988: { tpl: "[#1] Resistencia Crítica", el: null },
  1020: null,
  1050: { tpl: "[#1] Dominio Zona", el: null },
  1051: { tpl: "[#1] Dominio Monobjetivo", el: null },
  1052: { tpl: "[#1] Dominio Melé", el: null },
  1053: { tpl: "[#1] Dominio Distancia", el: null },
  1055: { tpl: "[#1] Dominio Berserker", el: null },
   1056: { tpl: "-[#1] Dominio Crítico", el: null },
   1060: { tpl: "-[#1] Dominio Distancia", el: null },
   1061: { tpl: "-[#1] Dominio Berserker", el: null },
   1062: { tpl: "-[#1] Resistencia Crítica", el: null },
   1063: { tpl: "-[#1] Resistencia por la Espalda", el: null },
  1068: { tpl: "[#1] Dominio", el: null },
  1069: { tpl: "[#1] Resistencia", el: null },
  2001: { tpl: "[#1]% Cantidad de Recolección", el: null },
};

function getActionColor(label) {
  for (const [el, cls] of Object.entries(ELEMENT_COLORS)) {
    if (label.includes(el)) return cls;
  }
  return "text-gray-200";
}

function computeValue(params, itemLevel) {
  if (!params || params.length === 0) return null;
  const base = params[0] || 0;
  const perLevel = params[1] || 0;
  return Math.floor(base + perLevel * itemLevel);
}

function renderTemplate(tpl, value, elKey) {
  let label = tpl
    .replace("[#1]", String(value));
  if (elKey && ELEMENT_NAMES[elKey]) {
    label = label.replace(`[${elKey}]`, ELEMENT_NAMES[elKey]);
  }
  return label;
}

/**
 * Parse equip effects into display lines.
 * Returns array of { actionId, label, value, icon, className, element }.
 */
export function parseItemStats(definition, itemLevel) {
  const effects = definition?.equipEffects;
  if (!effects || effects.length === 0) return [];

  return effects
    .map((ee) => {
      const def = ee.effect?.definition;
      if (!def) return null;
      const { actionId, params } = def;
      const meta = ACTION_META[actionId];
      if (!meta) return null;

      const value = computeValue(params, itemLevel);
      if (value === null || value === 0) return null;

      const label = renderTemplate(meta.tpl, String(value), meta.el);

      const numElements = (actionId === 1068 || actionId === 1069) && params?.[2] > 0 ? params[2] : 0;
      const finalLabel = numElements > 0 ? `${label} a ${numElements} elementos` : label;
      return {
        actionId,
        label: finalLabel,
        value,
        icon: getStatIcon(actionId),
        className: getActionColor(label),
        element: meta.el ? ELEMENT_NAMES[meta.el] : null,
      };
    })
    .filter(Boolean);
}

/**
 * Every action ID in items.json is a "gain" or "loss" variant of a stat.
 * Loss variants share the same canonical ID as the gain variant so they
 * can be summed together (with the value negated).
 *
 * Map: loss actionId → canonical gain actionId
 * Derived: PENALTY_IDS set and isPenaltyActionId check
 */
const CANONICAL_ACTION_ID = {
  90: 80,   100: 80,   96: 84,   97: 82,   98: 83,
  130: 120, 132: 122,
  161: 160, 168: 150, 172: 171,
  174: 173, 176: 175, 181: 180,
  192: 191,
  876: 875,
  1056: 149, 1060: 1053, 1061: 1055,
  1062: 988, 1063: 71,
};

const PENALTY_IDS = new Set(
  Object.keys(CANONICAL_ACTION_ID).map(Number),
);

function getCanonicalActionId(actionId) {
  return CANONICAL_ACTION_ID[actionId] ?? actionId;
}

function isPenaltyActionId(actionId) {
  return PENALTY_IDS.has(actionId);
}

/**
 * Gets or creates a stats group entry in the byGroup map.
 * Entries are keyed by canonical actionId (plus element count suffix
 * for multi-element stats like Dominio/Resistencia a X elementos).
 * This avoids repeated null checks and object creation boilerplate.
 */
function groupEntry(byGroup, actionId, el, numElements) {
  const key = numElements > 0 ? `${actionId}_${numElements}` : String(actionId);
  if (!byGroup[key]) {
    byGroup[key] = {
      actionId,
      value: 0,
      icon: getStatIcon(actionId),
      element: el ? ELEMENT_NAMES[el] : null,
      el,
      numElements,
    };
  }
  return byGroup[key];
}

export function aggregateItemStats(items) {
  const byGroup = {};

  for (const { definition, level } of items) {
    const effects = definition?.equipEffects;
    if (!effects) continue;
    for (const ee of effects) {
      const def = ee.effect?.definition;
      if (!def) continue;
      const { actionId, params } = def;
      const meta = ACTION_META[actionId];
      if (!meta) continue;

      const rawValue = computeValue(params, level);
      if (rawValue === null || rawValue === 0) continue;

      const canonicalId = getCanonicalActionId(actionId);
      const finalValue = isPenaltyActionId(actionId) ? -rawValue : rawValue;
      const numElements =
        (canonicalId === 1068 || canonicalId === 1069) && params?.[2] > 0
          ? params[2]
          : 0;
      groupEntry(byGroup, canonicalId, meta.el, numElements).value += finalValue;
    }
  }

  return Object.values(byGroup).map((s) => {
    const meta = ACTION_META[s.actionId];
    let label = renderTemplate(meta.tpl, String(s.value), s.el);
    if (s.numElements > 0) label = `${label} a ${s.numElements} elementos`;
    return {
      actionId: s.actionId,
      label,
      value: s.value,
      icon: s.icon,
      className: getActionColor(label),
      element: s.element,
    };
  });
}

/**
 * Maps character allocation stat keys to item action IDs and rates.
 * Each allocated point contributes `pts * rate` to the actionId group.
 * Some stats map to multiple actionIds (e.g. pmDmg gives PM + Dominio).
 */
const CHAR_TO_ACTION = {
  resistElemental: [{ actionId: 80, rate: 10 }],
  domElemental: [{ actionId: 120, rate: 5 }],
  domMelee: [{ actionId: 1052, rate: 8 }],
  domDistancia: [{ actionId: 1053, rate: 8 }],
  pv: [{ actionId: 20, rate: 20 }],
  placaje: [{ actionId: 173, rate: 6 }],
  esquiva: [{ actionId: 175, rate: 6 }],
  iniciativa: [{ actionId: 171, rate: 4 }],
  placajeEsquiva: [{ actionId: 173, rate: 4 }, { actionId: 175, rate: 4 }],
  voluntad: [{ actionId: 177, rate: 1 }],
  critPercent: [{ actionId: 150, rate: 1 }],
  anticipacionPercent: [{ actionId: 875, rate: 1 }],
  domCritico: [{ actionId: 149, rate: 4 }],
  domEspalda: [{ actionId: 180, rate: 6 }],
  domBerserker: [{ actionId: 1055, rate: 8 }],
  domCuras: [{ actionId: 26, rate: 6 }],
  resistEspalda: [{ actionId: 71, rate: 4 }],
  resistCritica: [{ actionId: 988, rate: 4 }],
  pa: [{ actionId: 31, rate: 1 }],
  pmDmg: [{ actionId: 41, rate: 1 }, { actionId: 120, rate: 20 }],
  rangeDmg: [{ actionId: 160, rate: 1 }, { actionId: 120, rate: 40 }],
  pw2: [{ actionId: 191, rate: 2 }],
  resistPercent: [{ actionId: 80, rate: 50 }],
  indirectDmg: [{ actionId: 120, rate: 40 }],
};

/**
 * Merges item stats and character allocation stats into a single
 * display-ready array.
 *
 * Algorithm — three phases:
 *   Phase 1 — Item effects: iterate each item's equipEffects, canonicalize
 *     the actionId (loss→gain), negate penalty values, sum by group.
 *   Phase 2 — Char allocation: map each allocated stat key through
 *     CHAR_TO_ACTION (e.g. "pa" → [{actionId:31, rate:1}]) and add.
 *   Phase 3 — Base & derived: inject base PA/PM/PW/crit that every
 *     character has, compute total HP from base + flat + %.
 */
const CLASS_PASSIVES = {
  sacro: [{ actionId: 20, getValue: (lvl) => lvl * 4 }],
  eni:   [{ actionId: 20, getValue: (lvl) => lvl * 2 }],
  sram:  [{ actionId: 150, getValue: () => 20 }],
  ocra:  [{ actionId: 160, getValue: () => 1 }],
  yop:   [{ actionId: 41, getValue: () => 1 }],
  zurka: [{ actionId: 150, getValue: () => 20 }],
};

export function mergeItemAndCharStats(items, allocStats, level, className) {
  const byGroup = {};

  const savedElements = allocStats?.elements;
  const elementPriority = savedElements?.length
    ? [...savedElements, ...ALL_ELEMENTS.filter((e) => !savedElements.includes(e))]
    : ALL_ELEMENTS;

  for (const { definition, level } of items) {
    const effects = definition?.equipEffects;
    if (!effects) continue;
    for (const ee of effects) {
      const def = ee.effect?.definition;
      if (!def) continue;
      const { actionId, params } = def;
      const meta = ACTION_META[actionId];
      if (!meta) continue;
      const rawValue = computeValue(params, level);
      if (rawValue === null || rawValue === 0) continue;
      const canonicalId = getCanonicalActionId(actionId);
      const finalValue = isPenaltyActionId(actionId) ? -rawValue : rawValue;
      const numElements =
        (canonicalId === 1068 || canonicalId === 1069) && params?.[2] > 0
          ? params[2]
          : 0;
      if (numElements > 0) {
        const perElementMap =
          canonicalId === 1068 ? ELEMENT_TO_MASTERY_ID : ELEMENT_TO_RESIST_ID;
        const selected = elementPriority.slice(0, numElements);
        for (const elName of selected) {
          const perActionId = perElementMap[elName];
          const el = ELEMENT_TO_EL[elName];
          groupEntry(byGroup, perActionId, el, 0).value += finalValue;
        }
      } else {
        groupEntry(byGroup, canonicalId, meta.el, numElements).value += finalValue;
      }
    }
  }

  for (const [key, pts] of Object.entries(allocStats)) {
    if (!pts) continue;
    const mapping = CHAR_TO_ACTION[key];
    if (!mapping) continue;
    for (const { actionId, rate } of mapping) {
      groupEntry(byGroup, actionId, null, 0).value += pts * rate;
    }
  }

  let classFlatHP = 0;
  if (className) {
    const passives = CLASS_PASSIVES[className];
    if (passives) {
      for (const { actionId, getValue } of passives) {
        const val = getValue(level);
        if (actionId === 20) {
          classFlatHP += val;
        } else {
          groupEntry(byGroup, actionId, null, 0).value += val;
        }
      }
    }
    if (className === "selo") {
      const rangeFromGear = byGroup["160"]?.value || 0;
      if (rangeFromGear >= 2) {
        groupEntry(byGroup, 41, null, 0).value += 1;
        groupEntry(byGroup, 160, null, 0).value -= 2;
      }
    }
  }

  const baseHP = 60 + 10 * (level - 1);
  const hpPctPts = allocStats.hpPercent || 0;
  const flatPdV = (byGroup["20"]?.value || 0) + classFlatHP;
  const totalHP = Math.round((baseHP + flatPdV) * (1 + hpPctPts * 0.04));
  groupEntry(byGroup, 20, null, 0).value = totalHP;

  const BASE_STATS = [
    { actionId: 31, base: 6 },
    { actionId: 41, base: 3 },
    { actionId: 191, base: 6 },
    { actionId: 150, base: 3 },
  ];

  for (const { actionId, base } of BASE_STATS) {
    groupEntry(byGroup, actionId, null, 0).value += base;
  }

  return Object.values(byGroup).map((s) => {
    const meta = ACTION_META[s.actionId];
    if (!meta) return null;
    let label = renderTemplate(meta.tpl, String(s.value), s.el);
    if (s.numElements > 0) label = `${label} a ${s.numElements} elementos`;
    return {
      actionId: s.actionId,
      label,
      value: s.value,
      icon: s.icon,
      className: getActionColor(label),
      element: s.element,
    };
  }).filter(Boolean);
}

/**
 * Look up the state name for an item that has an actionId 304 effect.
 * Returns the Spanish name or null if no state effect is found.
 */
function getItemStateData(item) {
  const stateEffect = item.definition?.equipEffects?.find(
    (ee) => ee.effect?.definition?.actionId === 304
  );
  if (!stateEffect) return null;
  const params = stateEffect.effect.definition.params;
  const stateId = params[0];
  const stateLevel = params[2] || 0;
  const state = statesData.find((s) => s.definition.id === stateId);
  if (!state) return null;
  let description = state?.description?.es || state?.description?.en || null;
  if (description && stateLevel) {
    description = description.replace(/\{value\}/g, (stateLevel * 0.01).toFixed(2));
  }
  return {
    name: state?.title?.es || state?.title?.en || null,
    description,
    stateLevel,
  };
}

/**
 * Extract item info for search/indexing.
 */
export function extractItemInfo(item) {
  const stateData = getItemStateData(item);
  const sublimationParams = item.definition?.item?.sublimationParameters;
  return {
    id: item.definition.item.id,
    level: item.definition.item.level,
    name: item.title?.es || item.title?.en || `Item #${item.definition.item.id}`,
    typeId: item.definition.item.baseParameters.itemTypeId,
    gfxId: item.definition.item.graphicParameters.gfxId,
    rarity: item.definition.item.baseParameters.rarity,
    stateName: stateData?.name || null,
    stateDescription: stateData?.description || null,
    stateLevel: stateData?.stateLevel || null,
    sublimationParams,
    definition: item.definition,
  };
}
