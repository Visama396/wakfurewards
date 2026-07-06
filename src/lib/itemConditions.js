/**
 * Item equip conditions.
 *
 * Some items in Wakfu require specific stat thresholds to equip
 * (e.g. "requires 8+ PW" or "requires ≤5 PM"). These conditions
 * are NOT present in items.json, so we define them manually here.
 *
 * Key: the item's Spanish name as shown in the game (lowercased).
 * Value: array of conditions, ALL of which must be met.
 *
 * Each condition:
 *   actionId  — stat identifier (see ACTION_META in itemStats.js)
 *   operator  — ">=" | "<="
 *   value     — threshold
 *   label     — human-readable description (shown in the UI)
 *
 * To add a new item condition, find the item's name in the game,
 * add an entry below, and the builder will automatically check it
 * when the user tries to equip the item.
 */

export const ITEM_EQUIP_CONDITIONS = {
  "botas tel talas": [
    { actionId: 191, operator: ">=", value: 8, label: "8 PW mínimo" },
  ],
  "kok tel": [
    { actionId: 41, operator: "<=", value: 5, label: "5 PM máximo" },
  ],
};

/**
 * Computes a flat stat map (actionId → total value) from the current
 * build: equipped items + character allocations + base stats.
 *
 * This is a lighter version of mergeItemAndCharStats that only
 * accumulates raw totals without element priority or display formatting.
 */
export function computeBuildStatMap(equippedItems, allocStats, level) {
  const byAction = {};

  function add(actionId, value) {
    byAction[actionId] = (byAction[actionId] || 0) + value;
  }

  // 1. Item effects
  for (const item of equippedItems) {
    const effects = item.definition?.equipEffects;
    if (!effects) continue;
    for (const ee of effects) {
      const def = ee.effect?.definition;
      if (!def) continue;
      const { actionId, params } = def;
      if (!params || params.length === 0) continue;
      const base = params[0] || 0;
      const perLevel = params[1] || 0;
      const value = Math.floor(base + perLevel * item.level);
      if (value === 0) continue;
      add(actionId, value);
    }
  }

  // 2. Character allocation stats
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

  for (const [key, pts] of Object.entries(allocStats)) {
    if (!pts) continue;
    const mapping = CHAR_TO_ACTION[key];
    if (!mapping) continue;
    for (const { actionId, rate } of mapping) {
      add(actionId, pts * rate);
    }
  }

  // 3. Base stats
  add(31, 6);  // PA base
  add(41, 3);  // PM base
  add(191, 6); // PW base
  add(150, 3); // Crit base

  return byAction;
}

/**
 * Checks whether all conditions for a given item are met.
 *
 * @param {string} itemName — Spanish name of the item
 * @param {object} statMap — actionId → total value from computeBuildStatMap
 * @returns {{ pass: boolean, failures: Array<{label: string, current: number}> }}
 */
/**
 * Checks whether all conditions for a given item are met.
 *
 * Returns the full list of conditions with their status, plus
 * the subset of failures.
 *
 * @param {string} itemName — Spanish name of the item
 * @param {object} statMap — actionId → total value from computeBuildStatMap
 * @returns {{
 *   pass: boolean,
 *   conditions: Array<{label: string, current: number, required: number, pass: boolean}>,
 *   failures: Array<{label: string, current: number, required: number}>,
 * }}
 */
export function checkItemConditions(itemName, statMap) {
  const key = itemName.toLowerCase();
  const conditions = ITEM_EQUIP_CONDITIONS[key];
  if (!conditions) return { pass: true, conditions: [], failures: [] };

  const results = [];
  const failures = [];
  for (const cond of conditions) {
    const current = statMap[cond.actionId] || 0;
    let pass = false;
    if (cond.operator === ">=") pass = current >= cond.value;
    else if (cond.operator === "<=") pass = current <= cond.value;
    results.push({ label: cond.label, current, required: cond.value, pass });
    if (!pass) {
      failures.push({ label: cond.label, current, required: cond.value });
    }
  }
  return { pass: failures.length === 0, conditions: results, failures };
}
