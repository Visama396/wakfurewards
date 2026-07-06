import { useState, useEffect } from "react";

/** Google Sheets API configuration for daily dungeon rotations */
const SPREADSHEET_ID = "1YXdxmQC9U3Ux7AuNnT8Cm3DR7kp1YYHenWuU3eQ5wbY";
const SPREADSHEET_SHEET = "[ES] Previsión";
const SPREADSHEET_API_KEY = import.meta.env.PUBLIC_VITE_GOOGLESHEET_KEY;

/**
 * Maps Google Sheets cell values (dungeon names as they appear in the sheet)
 * to the app-internal dungeon names (with emoji suffixes).
 */
export const SPREADSHEET_TO_APP = {
  "Guarida de los Tejaroxores": "Cojonidas 🍯🦡",
  "Volcán Or'Hodruin": "Señor de la Llama 🦙🌋",
  "Pico del Monte Zinit": "Ogrest 😭🦍",
  "Santuario de los Dragohuevos": "Dragohuevos 🐲🥚",
  "Cresta Helada": "Eternos 🌪️",
  "La Torre Mineral (lvl 200)": "Torre Mineral 🗼",
  "Cañón de los Plaguepardos": "Plaguepardos 🐯",
  "Fábrica de Buhatrás": "Buhatrás 🦉",
  "Tumba de Pandala": "Pandala 👻🐼",
  "Mazmorra Nievajas": "Nievajas 🐺",
  "Mazmorra Crustariscos": "Crustariscos 🦐",
  "Mazmorra Solgazanes": "Solgazanes 🦂",
  "Mazmorra Vandalienados": "Vandalienados 🐗",
  "Mazmorra de los Plantiguardias": "Plantigrados 🐻‍❄️🍯",
  "Mazmorra de los Güinos": "aaa Sumorsa 👑🦭",
  "Mazmorra de los Escapatarazones": "Escapatrajos 🐢卍",
  "Mazmorra de los Fitoformes": "Pitoformes 🍆",
  "Mazmorra de los Demorribles": "Feos 🩸🦇",
  "Mazmorra de los Vaciantes": "Ar'mando 🌮",
  "Mazmorra de los Idos": "Locos 👁️👁️",
  "Mazmorra de los Devastadores": "Muertos 🧟💀",
  "Mazmorra Steamers": "Pechofríos",
  "Mazmorra Pezgajosos Abisales": "Pegajosos",
  Necromundo: "Muertohambres",
};

/**
 * Fetches today's DJ and Modulox dungeon rotations from Google Sheets.
 * Returns an object with two Sets: dailyDungeonNames and moduloxDungeonNames.
 * Falls back silently to empty sets on fetch errors.
 */
export function useFetchDailies() {
  const [dailyDungeonNames, setDailyDungeonNames] = useState(new Set());
  const [moduloxDungeonNames, setModuloxDungeonNames] = useState(new Set());

  useEffect(() => {
    async function fetchTodayDailies() {
      const base = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SPREADSHEET_SHEET)}`;
      try {
        const [dailyRes, moduloxRes] = await Promise.all([
          fetch(`${base}!D4:D19?key=${SPREADSHEET_API_KEY}`),
          fetch(`${base}!D21:D25?key=${SPREADSHEET_API_KEY}`),
        ]);
        const dailyData = await dailyRes.json();
        const moduloxData = await moduloxRes.json();
        if (dailyData.values) {
          const names = dailyData.values
            .map((row) => SPREADSHEET_TO_APP[row[0]])
            .filter(Boolean);
          setDailyDungeonNames(new Set(names));
        }
        if (moduloxData.values) {
          const names = moduloxData.values
            .map((row) => SPREADSHEET_TO_APP[row[0]])
            .filter(Boolean);
          setModuloxDungeonNames(new Set(names));
        }
      } catch {
        // spreadsheet fetch failed silently
      }
    }
    fetchTodayDailies();
  }, []);

  return { dailyDungeonNames, moduloxDungeonNames };
}
