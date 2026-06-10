// Perfil por defecto para mazmorras sin configuración específica.
// roleMinima define los requisitos mínimos de roles en el equipo.
// teamSize: 6 = mazmorra normal, 3 = mazmorra pequeña (Torre Mineral, Necromundo).
const DEFAULT_PROFILE = {
  classScores: {},
  roleMinima: { Support: 2, CaC: 1, DaD: 1 },
  explanation: "Sin recomendaciones específicas para esta mazmorra",
  teamSize: 6,
};

// Cada entrada es un perfil de mazmorra.
// classScores: { clase: puntuación } — positiva si se recomienda, negativa si se penaliza.
// roleMinima: { Support, CaC, DaD } — mínimos exigidos. xD puede cubrir CaC o DaD.
// teamSize: 6 para mazmorras de equipo completo, 3 para mazmorras pequeñas.
export const DUNGEON_PROFILES = {
  // Castiga armadura (Feca) y berserk (Sacro)
  cojonidas: {
    classScores: { feca: -3, sacro: -3, eni: 2, sram: 2 },
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "Castiga armadura (Feca) y berserk (Sacro)",
    teamSize: 6,
  },
  // El jefe se mueve constantemente → los CaC lo pasan mal, mejor ranged/DaD
  buhatras: {
    classScores: {
      ocra: 2,
      anu: -2,
      xelor: 1,
      eni: 1,
      feca: 1,
      sacro: -1,
      yop: -2,
      zurka: 1,
      zobal: -1,
    },
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "El jefe no deja de moverse, los CaC lo tienen difícil",
    teamSize: 6,
  },
  // El posicionamiento es clave → clases con control/movimiento destacan
  pandala: {
    classScores: { panda: 3, feca: 2, sadida: 1 },
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "El posicionamiento es muy importante",
    teamSize: 6,
  },
  // Mazmorras de 3 personas: 2 Supports y 1 rol flexible (sin mínimo CaC/DaD)
  torremineral: {
    classScores: {},
    roleMinima: { Support: 2 },
    explanation: "Mazmorra para 3 personas: 2 Supports y 1 flexible",
    teamSize: 3,
  },
  necromundo: {
    classScores: {},
    roleMinima: { Support: 2 },
    explanation: "Mazmorra para 3 personas: 2 Supports y 1 flexible",
    teamSize: 3,
  },
  aaasumorsa: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  armando: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  crustariscos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  dragohuevos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  escapatrajos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  eternos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  feos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  locos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  muertos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  muertohambres: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  nievajas: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  ogrest: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  pechofrios: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  pegajosos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  pitoformes: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  plaguepardos: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  plantigrados: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  senordelallama: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  solgazanes: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
  vandalienados: {
    classScores: {},
    roleMinima: { Support: 2, CaC: 1, DaD: 1 },
    explanation: "",
    teamSize: 6,
  },
};

// Normaliza el nombre de la mazmorra a minúsculas sin acentos ni signos
// para buscar su perfil. Ej: "Pechofríos" → "pechofrios", "Or'Hodruin" → "orhodruin".
export function getProfile(dungeonName) {
  const key = dungeonName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]/g, "");

  return DUNGEON_PROFILES[key] || { ...DEFAULT_PROFILE };
}
