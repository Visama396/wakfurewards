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
  875: "DODGE",
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

const ELEMENT_COLORS = {
  Fuego: "text-orange-400",
  Agua: "text-blue-400",
  Aire: "text-fuchsia-400",
  Tierra: "text-green-500",
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
 * Aggregate stats from multiple items, summing values by actionId.
 * Items: array of { definition, level }
 * Returns array of stat objects (same shape as parseItemStats return).
 */
function getCanonicalActionId(actionId) {
  if (actionId === 174) return 173;
  if (actionId === 176) return 175;
  return actionId;
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

      const value = computeValue(params, level);
      if (value === null || value === 0) continue;

      const canonicalId = getCanonicalActionId(actionId);
      const numElements =
        (canonicalId === 1068 || canonicalId === 1069) && params?.[2] > 0
          ? params[2]
          : 0;
      const groupKey = numElements > 0 ? `${canonicalId}_${numElements}` : String(canonicalId);

      if (!byGroup[groupKey]) {
        byGroup[groupKey] = {
          actionId: canonicalId,
          value: 0,
          icon: getStatIcon(canonicalId),
          element: meta.el ? ELEMENT_NAMES[meta.el] : null,
          el: meta.el,
          numElements,
        };
      }
      byGroup[groupKey].value += value;
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

export function mergeItemAndCharStats(items, allocStats, level) {
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
      const value = computeValue(params, level);
      if (value === null || value === 0) continue;
      const canonicalId = getCanonicalActionId(actionId);
      const numElements =
        (canonicalId === 1068 || canonicalId === 1069) && params?.[2] > 0
          ? params[2]
          : 0;
      const groupKey = numElements > 0 ? `${canonicalId}_${numElements}` : String(canonicalId);
      if (!byGroup[groupKey]) {
        byGroup[groupKey] = {
          actionId: canonicalId,
          value: 0,
          icon: getStatIcon(canonicalId),
          element: meta.el ? ELEMENT_NAMES[meta.el] : null,
          el: meta.el,
          numElements,
        };
      }
      byGroup[groupKey].value += value;
    }
  }

  for (const [key, pts] of Object.entries(allocStats)) {
    if (!pts) continue;
    const mapping = CHAR_TO_ACTION[key];
    if (!mapping) continue;
    for (const { actionId, rate } of mapping) {
      const groupKey = String(actionId);
      if (!byGroup[groupKey]) {
        byGroup[groupKey] = {
          actionId,
          value: 0,
          icon: getStatIcon(actionId),
          element: null,
          el: null,
          numElements: 0,
        };
      }
      byGroup[groupKey].value += pts * rate;
    }
  }

  const hpPctPts = allocStats.hpPercent || 0;
  if (hpPctPts > 0 || byGroup["20"]) {
    const baseHP = 60 + 10 * (level - 1);
    const flatPdV = byGroup["20"]?.value || 0;
    const total = Math.round((baseHP + flatPdV) * (1 + hpPctPts * 0.04));
    if (!byGroup["20"]) {
      byGroup["20"] = {
        actionId: 20,
        value: 0,
        icon: getStatIcon(20),
        element: null,
        el: null,
        numElements: 0,
      };
    }
    byGroup["20"].value = total;
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
 * Extract item info for search/indexing.
 */
export function extractItemInfo(item) {
  const effects = item.definition?.equipEffects || [];
  const hasState = effects.some(
    (ee) => ee.effect?.definition?.actionId === 304
  );
  const sublimationParams = item.definition?.item?.sublimationParameters;
  return {
    id: item.definition.item.id,
    level: item.definition.item.level,
    name: item.title?.es || item.title?.en || `Item #${item.definition.item.id}`,
    typeId: item.definition.item.baseParameters.itemTypeId,
    gfxId: item.definition.item.graphicParameters.gfxId,
    rarity: item.definition.item.baseParameters.rarity,
    hasState,
    sublimationParams,
    definition: item.definition,
  };
}
