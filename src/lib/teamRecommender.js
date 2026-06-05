import { getProfile } from "@/data/dungeonProfiles";

// Límite de seguridad para evitar bloquear el navegador con combinaciones infinitas
const MAX_COMBOS = 800_000;

// Generador eficiente de combinaciones de k elementos desde un array.
// Devuelve un permutación iterativa sin recursión excesiva.
// Orden lexicográfico: estable, predecible, sin duplicados.
function* combine(arr, k) {
  if (k === 0) { yield []; return; }
  if (k > arr.length) return;

  const indices = Array.from({ length: k }, (_, i) => i);

  while (true) {
    yield indices.map((i) => arr[i]);

    // Avanza al siguiente conjunto de índices en orden lexicográfico
    let i = k - 1;
    while (i >= 0 && indices[i] === arr.length - k + i) i--;
    if (i < 0) return;
    indices[i]++;
    for (let j = i + 1; j < k; j++) indices[j] = indices[j - 1] + 1;
  }
}

export function recommendTeam(dungeonName, availableChars) {
  const profile = getProfile(dungeonName);
  const teamSize = profile.teamSize;

  // Validación rápida: debe haber al menos teamSize personajes disponibles
  if (availableChars.length < teamSize) {
    return {
      teams: [],
      explanation: profile.explanation,
      error: `Se necesitan al menos ${teamSize} personajes disponibles (hay ${availableChars.length})`,
    };
  }

  // Comprobación previa de que hay suficientes Supports entre todos los disponibles
  const supports = availableChars.filter((c) => c.charrole === "Support");
  const minSupport = profile.roleMinima.Support || 0;

  if (supports.length < minSupport) {
    return { teams: [], explanation: profile.explanation, error: `Se necesitan al menos ${minSupport} Supports disponibles` };
  }

  // Comprobación previa de CaC/DaD (si aplica según el perfil)
  // xD puede cubrir tanto CaC como DaD, por eso se suma a ambos totales
  const cac = availableChars.filter((c) => c.charrole === "CaC");
  const dad = availableChars.filter((c) => c.charrole === "DaD");
  const xd = availableChars.filter((c) => c.charrole === "xD");
  const minCaC = profile.roleMinima.CaC || 0;
  const minDaD = profile.roleMinima.DaD || 0;

  if (minCaC > 0 || minDaD > 0) {
    const totalCaC = cac.length + xd.length;
    const totalDaD = dad.length + xd.length;
    if (totalCaC < minCaC) {
      return { teams: [], explanation: profile.explanation, error: `Se necesitan al menos ${minCaC} CaC disponible (contando xD como CaC)` };
    }
    if (totalDaD < minDaD) {
      return { teams: [], explanation: profile.explanation, error: `Se necesitan al menos ${minDaD} DaD disponible (contando xD como DaD)` };
    }
  }

  // Asigna puntuación a cada personaje según el perfil de la mazmorra
  // Clases no listadas reciben 0 (neutro)
  const scored = availableChars.map((c) => ({
    ...c,
    score: profile.classScores[c.class] ?? 0,
  }));

  const topTeams = [];
  let count = 0;

  // Genera todas las combinaciones posibles de teamSize personajes
  // y filtra las que cumplen los requisitos de roles y jugadores
  for (const team of combine(scored, teamSize)) {
    count++;
    if (count > MAX_COMBOS) break;

    const sup = team.filter((c) => c.charrole === "Support").length;
    const ca = team.filter((c) => c.charrole === "CaC").length;
    const da = team.filter((c) => c.charrole === "DaD").length;
    const xd = team.filter((c) => c.charrole === "xD").length;

    // Cada jugador puede llevar como máximo 3 personajes al mismo equipo
    const playerCounts = {};
    let playerLimitOk = true;
    for (const c of team) {
      playerCounts[c.player] = (playerCounts[c.player] || 0) + 1;
      if (playerCounts[c.player] > 3) { playerLimitOk = false; break; }
    }

    // Validación de roles:
    // - Support mínimo exigido por el perfil
    // - xD cuenta como CaC Y DaD a la vez (son versátiles, rinden igual en ambos)
    //   Así que un solo xD cubre ambos mínimos si hiciera falta
    const rolesOk = sup >= minSupport
      && (ca + xd) >= minCaC
      && (da + xd) >= minDaD;

    if (rolesOk && playerLimitOk) {
      const totalScore = team.reduce((s, c) => s + c.score, 0);

      // Mantiene solo el top 3 ordenado por puntuación descendente
      if (topTeams.length < 3) {
        topTeams.push({ members: team, totalScore });
        topTeams.sort((a, b) => b.totalScore - a.totalScore);
      } else if (totalScore > topTeams[2].totalScore) {
        topTeams[2] = { members: team, totalScore };
        topTeams.sort((a, b) => b.totalScore - a.totalScore);
      }
    }
  }

  if (topTeams.length === 0) {
    return {
      teams: [],
      explanation: profile.explanation,
      error: "No se encontraron equipos válidos con las restricciones",
    };
  }

  return { teams: topTeams, explanation: profile.explanation };
}
