import { useState, useEffect } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combina clases de Tailwind con soporte para conflictos (clsx + tailwind-merge) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detecta si el dispositivo tiene puntero preciso (ratón) vs táctil.
 * Útil para decidir entre hover tooltips (desktop) y collapsibles (móvil).
 */
export function useIsFinePointer() {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFine(mq.matches);
    const handler = (e) => setIsFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isFine;
}

/**
 * Normaliza un nombre de mazmorra a una clave lowercase sin acentos ni signos.
 * Ej: "Señor de la Llama 🦙🌋" → "senordelallama"
 * Esto permite buscar en DUNGEON_PROFILES, SPELLS y RAW_GUIDES desde nombres
 * que vienen de Google Sheets o de la UI.
 */
export function normalizeDungeonName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]/g, "");
}
