export const BRANCHES = [
  {
    key: "intelligence",
    label: "Inteligencia",
    stats: [
      { key: "hpPercent", label: "% PdV", cap: null },
      { key: "resistElemental", label: "Resistencia Elemental", cap: 10 },
      { key: "barrera", label: "Barrera", cap: 10 },
      { key: "curaPercent", label: "% Curas Recibidas", cap: 10 },
      { key: "vidaArmadura", label: "% de Vida en Armadura", cap: 10 },
    ],
  },
  {
    key: "force",
    label: "Fuerza",
    stats: [
      { key: "domElemental", label: "Dominio Elemental", cap: null },
      { key: "domMelee", label: "Dominio Melé", cap: 40 },
      { key: "domDistancia", label: "Dominio Distancia", cap: 40 },
      { key: "pv", label: "Puntos de Vida", cap: null },
    ],
  },
  {
    key: "agility",
    label: "Agilidad",
    stats: [
      { key: "placaje", label: "Placaje", cap: null },
      { key: "esquiva", label: "Esquiva", cap: null },
      { key: "iniciativa", label: "Iniciativa", cap: 20 },
      { key: "placajeEsquiva", label: "Placaje y Esquiva", cap: 20 },
      { key: "voluntad", label: "Voluntad", cap: 20 },
    ],
  },
  {
    key: "chance",
    label: "Suerte",
    stats: [
      { key: "critPercent", label: "% Golpe Crítico", cap: 20 },
      { key: "anticipacionPercent", label: "% Anticipación", cap: 20 },
      { key: "domCritico", label: "Dominio Crítico", cap: null },
      { key: "domEspalda", label: "Dominio Espalda", cap: null },
      { key: "domBerserker", label: "Dominio Berserker", cap: null },
      { key: "domCuras", label: "Dominio Curas", cap: null },
      { key: "resistEspalda", label: "Resistencia Espalda", cap: null },
      { key: "resistCritica", label: "Resistencia Crítica", cap: null },
    ],
  },
  {
    key: "major",
    label: "Mayor",
    stats: [
      { key: "pa", label: "Punto de Acción", cap: 1 },
      { key: "pmDmg", label: "Punto de Movimiento y Daños", cap: 1 },
      { key: "rangeDmg", label: "Alcance y Daños", cap: 1 },
      { key: "pw2", label: "Puntos de Wakfu", cap: 1 },
      { key: "armorGiven", label: "% Armadura Dada", cap: 1 },
      { key: "dmgPercent", label: "% Daño Infligido", cap: 1 },
      { key: "resistPercent", label: "Resistencia Elemental", cap: 1 },
      { key: "healPercent", label: "% Curas Realizadas", cap: 1 },
      { key: "indirectDmg", label: "% Daño Indirecto", cap: 1 },
    ],
  },
];

export function createDefaultStats() {
  const stats = {};
  for (const branch of BRANCHES) {
    for (const s of branch.stats) {
      stats[s.key] = 0;
    }
  }
  return stats;
}

export function getBranchPoints(level) {
  const branches = ["intelligence", "force", "agility", "chance"];
  const points = {};
  for (const b of branches) {
    const i = branches.indexOf(b);
    points[b] = Math.max(0, Math.floor((level + 2 - i) / 4));
  }
  points.major = level >= 25 ? 1 + Math.floor((level - 25) / 50) : 0;
  return points;
}

const STAT_COMPUTE = {
  hpPercent: (pts, lvl) => {
    const baseHP = 60 + 10 * (lvl - 1);
    const pct = pts * 4;
    return { value: `${pct}% → +${Math.round(baseHP * pct / 100)} PdV` };
  },
  resistElemental: (pts) => ({ value: `+${pts * 10} Resistencia Elemental` }),
  barrera: (pts) => ({ value: `${pts} veces/turno (50% del nivel)` }),
  curaPercent: (pts) => ({ value: `+${pts * 6}% Curas Recibidas` }),
  vidaArmadura: (pts) => ({ value: `+${pts * 4}% Vida en Armadura` }),
  domElemental: (pts) => ({ value: `+${pts * 5} Dominio Elemental` }),
  domMelee: (pts) => ({ value: `+${pts * 8} Dominio Melé` }),
  domDistancia: (pts) => ({ value: `+${pts * 8} Dominio Distancia` }),
  pv: (pts) => ({ value: `+${pts * 20} PdV` }),
  placaje: (pts) => ({ value: `+${pts * 6} Placaje` }),
  esquiva: (pts) => ({ value: `+${pts * 6} Esquiva` }),
  iniciativa: (pts) => ({ value: `+${pts * 4} Iniciativa` }),
  placajeEsquiva: (pts) => ({ value: `+${pts * 4} Placaje y +${pts * 4} Esquiva` }),
  voluntad: (pts) => ({ value: `+${pts} Voluntad` }),
  critPercent: (pts) => ({ value: `${3 + pts}% Golpe Crítico (base ${3}%)` }),
  anticipacionPercent: (pts) => ({ value: `+${pts}% Anticipación` }),
  domCritico: (pts) => ({ value: `+${pts * 4} Dominio Crítico` }),
  domEspalda: (pts) => ({ value: `+${pts * 6} Dominio Espalda` }),
  domBerserker: (pts) => ({ value: `+${pts * 8} Dominio Berserker` }),
  domCuras: (pts) => ({ value: `+${pts * 6} Dominio Curas` }),
  resistEspalda: (pts) => ({ value: `+${pts * 4} Resistencia Espalda` }),
  resistCritica: (pts) => ({ value: `+${pts * 4} Resistencia Crítica` }),
  pa: () => ({ value: "1 PA" }),
  pmDmg: () => ({ value: "1 PM, +20 Dominio Elemental" }),
  rangeDmg: () => ({ value: "1 Alcance, +40 Dominio Elemental" }),
  pw2: () => ({ value: "2 PW (150 BQ)" }),
  armorGiven: () => ({ value: "20% Armadura Dada" }),
  dmgPercent: () => ({ value: "10% Daño Infligido" }),
  resistPercent: () => ({ value: "50 Resistencia Elemental" }),
  healPercent: () => ({ value: "10% Curas Realizadas" }),
  indirectDmg: () => ({ value: "10% Daño Indirecto, +40 Dominio Elemental" }),
};

export function computeEffectiveStats(allocStats, level) {
  const result = {};
  for (const [key, fn] of Object.entries(STAT_COMPUTE)) {
    const pts = allocStats[key] || 0;
    result[key] = pts > 0 ? fn(pts, level) : null;
  }
  return result;
}
