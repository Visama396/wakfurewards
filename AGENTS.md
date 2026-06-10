# WakfuRewards — AGENTS

## Project Overview

Wakfu dungeon rewards tracker for a static group. Tracks monthly dungeon completions, stasis (reward chests), daily rotation from Google Sheets, team recommendations, and dungeon guides.

## Tech Stack

- **Framework:** Astro 6 (SPA via React 19)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Radix UI, Base UI
- **Backend:** Supabase (wakfuchars, wakfudungs, wakfurewards tables)
- **External:** Google Sheets API v4 (daily rotation feed)
- **Deploy:** Netlify (adapter)
- **Package manager:** Bun
- **Language:** JavaScript / JSX (no TypeScript in components)

## Conventions

### Code style
- No comments in components unless the logic is non-obvious
- Use JSX for components, `.jsx` extension
- Utility functions in `.js` or `.ts`
- Tailwind classes for all styling
- Import aliases via `@/` (maps to `src/`)

### Naming
- **Components:** PascalCase, one component per file
- **Data files:** camelCase (dungeonProfiles.js, dungeonGuides.js)
- **State:** explicit `useState` calls, avoid prop drilling (single App.jsx orchestrator)
- **Files:** lowercase with dots for delimiters (e.g., `teamRecommender.js`, not `team-recommender.js`)

### Dungeon names
- Dungeon names come from Supabase (`wakfudungs.name`)
- `SPREADSHEET_TO_APP` in `App.jsx` maps Google Sheet cell values → app dungeon names
- `getProfile(dungeonName)` in `dungeonProfiles.js` normalizes the name: lowercase → NFD → strip diacritics → strip apostrophes → strip non-alphanumeric
- `getGuide(dungeonName)` in `dungeonGuides.js` uses the same normalization
- Keys in `DUNGEON_PROFILES`, `SPELLS`, and `RAW_GUIDES` must match normalized dungeon names
- When changing a dungeon's display name, update all three files: `App.jsx` (SPREADSHEET_TO_APP), `dungeonProfiles.js` (key), `dungeonGuides.js` (SPELLS + RAW_GUIDES keys), and `DungeonIcon.jsx` (DUNGEON_ICONS key)

### Data flow
- `App.jsx` owns all state, loads data from Supabase on mount
- Google Sheets fetched in parallel for daily DJ & Modulox rotations
- Child components are presentational or modal; they call callbacks from App
- After any mutation (add/update/delete reward, toggle role), `loadData()` re-fetches everything

### Dungeon profiles (dungeonProfiles.js)
```js
clave: {
  classScores: { clase: 2, otraclase: -1 },  // positive = recommended, negative = penalized
  roleMinima: { Support: 2, CaC: 1, DaD: 1 },
  explanation: "Descripción corta de la mecánica clave",
  teamSize: 6,  // 6 for normal, 3 for small dungeons
}
```

### Dungeon guides (dungeonGuides.js)
```js
// SPELLS — spell definitions with tooltip HTML
clave: {
  spellkey: {
    nombre: "Display Name",
    element: "Aire" | "Tierra" | "Fuego" | "Agua",
    html: `<span class="block space-y-1">...</span>`,
  },
}

// RAW_GUIDES — guide HTML, use <<SpellName>> for injectable spell tooltips
clave: `<div>...</div>`,
```

### Roles
- `CaC` (melee) — red
- `DaD` (ranged) — blue
- `Support` — green
- `xD` (flexible) — purple, counts as both CaC and DaD
- `Padre Ausente` (inactive) — gray, hidden from active lists

## Commands

| Command | Action |
|---|---|
| `bun install` | Install deps |
| `bun dev` | Dev server at `localhost:4321` |
| `bun build` | Production build to `dist/` |
| `bun preview` | Preview production build |
