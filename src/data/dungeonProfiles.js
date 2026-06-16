import { normalizeDungeonName } from "@/lib/utils";

/**
 * Perfil por defecto para mazmorras sin configuración específica.
 * roleMinima: mínimos de roles exigidos. teamSize: 6 normal, 3 pequeña.
 */
const DEFAULT_PROFILE = {
  classScores: {
    anu: 0, eni: 0, feca: 0, hiper: 0, ocra: 0, osa: 0,
    panda: 0, sacro: 0, sadida: 0, selo: 0, sram: 0,
    steamer: 0, tyma: 0, ugi: 0, xelor: 0, yop: 0,
    zobal: 0, zurka: 0,
  },
  roleMinima: { apoyo: 2, mele: 1, distancia: 1 },
  explanation: "Sin recomendaciones específicas para esta mazmorra",
  teamSize: 6,
};

/**
 * Perfiles de mazmorras con:
 * - classScores: { clase: puntuación } — positiva si recomendada, negativa si penalizada
 * - roleMinima: { apoyo, mele, distancia } — xD puede cubrir mele o distancia
 * - teamSize: 6 para equipo completo, 3 para mazmorras pequeñas (Torre Mineral, Necromundo)
 */
export const DUNGEON_PROFILES = {
  cojonidas: {
    classScores: {
      anu: 0, eni: 1, feca: -1, hiper: 0, ocra: 0, osa: 1,
      panda: 1, sacro: -1, sadida: 0, selo: 1, sram: 0,
      steamer: 1, tyma: 1, ugi: 0, xelor: -1, yop: 0,
      zobal: 1, zurka: 1,
    },
    roleMinima: { apoyo: 2, mele: 1, distancia: 1 },
    explanation: "Castiga armadura (Feca) y berserk (Sacro)",
    teamSize: 6,
  },
  buhatras: {
    classScores: {
      anu: -2, eni: 1, feca: 1, hiper: 0, ocra: 2, osa: 0,
      panda: 0, sacro: -1, sadida: 0, selo: 0, sram: 0,
      steamer: 0, tyma: 0, ugi: 0, xelor: 1, yop: -2,
      zobal: -1, zurka: 1,
    },
    roleMinima: { apoyo: 2, mele: 1, distancia: 1 },
    explanation: "El jefe no deja de moverse, los mele lo tienen difícil",
    teamSize: 6,
  },
  pandala: {
    classScores: {
      anu: 0, eni: 0, feca: 2, hiper: 0, ocra: 0, osa: 0,
      panda: 3, sacro: 0, sadida: 1, selo: 0, sram: 0,
      steamer: 0, tyma: 0, ugi: 0, xelor: 0, yop: 0,
      zobal: 0, zurka: 0,
    },
    roleMinima: { apoyo: 2, mele: 1, distancia: 1 },
    explanation: "El posicionamiento es muy importante",
    teamSize: 6,
  },
  torremineral: {
    classScores: {
      anu: 0, eni: 0, feca: 0, hiper: 0, ocra: 0, osa: 0,
      panda: 0, sacro: 0, sadida: 0, selo: 0, sram: 0,
      steamer: 0, tyma: 0, ugi: 0, xelor: 0, yop: 0,
      zobal: 0, zurka: 0,
    },
    roleMinima: { apoyo: 2 },
    explanation: "Mazmorra para 3 personas: 2 Supports y 1 flexible",
    teamSize: 3,
  },
  necromundo: {
    classScores: {
      anu: 0, eni: 0, feca: 0, hiper: 0, ocra: 0, osa: 0,
      panda: 0, sacro: 0, sadida: 0, selo: 0, sram: 0,
      steamer: 0, tyma: 0, ugi: 0, xelor: 0, yop: 0,
      zobal: 0, zurka: 0,
    },
    roleMinima: { apoyo: 2 },
    explanation: "Mazmorra para 3 personas: 2 Supports y 1 flexible",
    teamSize: 3,
  },
  senordelallama: {
    classScores: {
      anu: 0, eni: 0, feca: 0, hiper: 0, ocra: 0, osa: 0,
      panda: 0, sacro: 0, sadida: 0, selo: 0, sram: 0,
      steamer: 0, tyma: 0, ugi: 0, xelor: 0, yop: 0,
      zobal: 0, zurka: 0,
    },
    roleMinima: { apoyo: 2, mele: 1, distancia: 1 },
    explanation: "No hay recomendaciones para esta mazmorra",
    teamSize: 6,
  },
};

/**
 * Busca el perfil de una mazmorra por su nombre (con emojis, acentos, etc.).
 * Normaliza el nombre a clave plana y devuelve el perfil o una copia del default.
 */
export function getProfile(dungeonName) {
  const key = normalizeDungeonName(dungeonName);
  return DUNGEON_PROFILES[key] || { ...DEFAULT_PROFILE };
}
