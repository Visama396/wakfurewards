// Fichas de hechizos por mazmorra. key: nombre normalizado del hechizo.
// Solo usamos <span> con clases block/flex para evitar HTML inválido
// (un <div> dentro de un <span> hace que el navegador cierre el span).

const ELEMENT_COLORS = {
  Aire: {
    label: "text-fuchsia-400",
    ref: "text-fuchsia-300 border-fuchsia-400/60",
  },
  Tierra: {
    label: "text-green-500",
    ref: "text-green-400 border-green-500/60",
  },
  Fuego: { label: "text-red-400", ref: "text-red-300 border-red-400/60" },
  Agua: { label: "text-blue-400", ref: "text-blue-300 border-blue-400/60" },
};

export const SPELLS = {
  tejaroxores: {
    garras: {
      nombre: "Garras",
      element: "Aire",
      html: `
        <span class="block space-y-1">
          <span class="flex items-center gap-2 text-xs">
            <span class="${ELEMENT_COLORS.Aire.label} font-medium">Aire</span>
            <span class="text-gray-400">·</span>
            <span>2 PA</span>
            <span class="text-gray-400">·</span>
            <span>2 usos/objetivo</span>
            <span class="text-gray-400">·</span>
            <span>4 usos/turno</span>
          </span>
          <span class="block text-xs text-gray-300">
            Daño: <span class="text-yellow-300">119</span> (ignora armadura)
          </span>
          <span class="block text-xs text-yellow-400">
            Crítico: <span class="text-yellow-200">149</span> (ignora armadura)
          </span>
        </span>
      `,
    },
    golpesismico: {
      nombre: "Golpe Sísmico",
      element: "Tierra",
      html: `
        <span class="block space-y-1">
          <span class="flex items-center gap-2 text-xs">
            <span class="${ELEMENT_COLORS.Tierra.label} font-medium">Tierra</span>
            <span class="text-gray-400">·</span>
            <span>3 PA</span>
            <span class="text-gray-400">·</span>
            <span>2 usos/turno</span>
          </span>
          <span class="block text-xs text-gray-300">
            Daño: <span class="text-yellow-300">139</span>
          </span>
          <span class="block text-xs text-yellow-400">
            Crítico: <span class="text-yellow-200">174</span>
          </span>
          <span class="block text-xs text-gray-500 italic">
            Condición: No puede lanzarse durante <span class="text-gray-300">Lucha Feroz</span>
          </span>
        </span>
      `,
    },
  },
};

// Reemplaza <<Nombre>> por un span con data-atributos.
// El tooltip lo renderiza DungeonGuideModal con React (portal al body)
// para evitar que el overflow-y-auto del modal lo corte.
function injectSpellTooltips(html, dungeonKey) {
  const spells = SPELLS[dungeonKey];
  if (!spells) return html;

  return html.replace(/<<([^>]+)>>/g, (match, name) => {
    const spellKey = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]/g, "");

    const spell = spells[spellKey];
    if (!spell) return match;

    const colors = ELEMENT_COLORS[spell.element] || {
      ref: "text-amber-300 border-amber-400/60",
    };
    return `<span class="spell-ref cursor-help border-b border-dotted ${colors.ref}" data-dungeon="${dungeonKey}" data-spell="${spellKey}">${spell.nombre}</span>`;
  });
}

// Guías de mazmorras en formato HTML (sin processar, con <<Hechizo>>).
const RAW_GUIDES = {
  tejaroxores: `
    <div class="flex flex-col-reverse sm:flex-row gap-3 mb-3">
      <video src="/guides/tejonidasfase1.mp4" autoplay loop muted playsinline class="rounded max-w-full sm:w-2/5 sm:max-w-[300px] shrink-0"></video>
      <div>
        <h3 class="text-base font-semibold text-orange-300 mb-1">Fase 1</h3>
        <p class="text-sm text-gray-400 mb-2">De 100% hasta 70% de PdV</p>
        <p class="text-sm text-gray-300">
          Comportamiento: Ataca enemigos con <<Garras>> e intenta terminar lo más cercano posible a los jugadores.
          Usa <<Golpe Sísmico>> si hay al menos 2 jugadores lo suficientemente cerca como para que alcance a varios
          objetivos. No necesita usar <<Golpe Sísmico>> sobre un objetivo; puede usarlo en casillas vacías siempre que
          el resto del área alcance a varios enemigos.
        </p>
      </div>
    </div>
  `,
};

// Normaliza el nombre igual que en dungeonProfiles para buscar la guía
export function getGuide(dungeonName) {
  const key = dungeonName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]/g, "");

  const raw = RAW_GUIDES[key];
  if (!raw) return null;

  return injectSpellTooltips(raw, key);
}
