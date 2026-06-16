# WakfuRewards

Trackeador de recompensas de mazmorras de fin de mes para un grupo estático de Wakfu.

## Features

- **Recompensas mensuales** — Registra qué personajes han completado qué mazmorras cada mes con su valor de stasis
- **Rotación diaria** — Consulta la lista de mazmorras del DJ diario y Modulox desde Google Sheets
- **Recomendador de equipo** — Genera combinaciones de equipo óptimas según perfiles de mazmorra y roles
- **Guías de mazmorras** — Guías visuales con tooltips de hechizos interactivos
- **Filtros** — Filtra por jugador, rol o búsqueda por nombre
- **Padres Ausentes** — Marca personajes inactivos y muévelos fuera de las listas activas
- **Contador regresivo** — Muestra días restantes hasta fin de mes

## Stack

- **Frontend:** Astro, React 19, Tailwind CSS 4, shadcn/ui, Radix UI, Base UI
- **Backend:** Supabase (PostgreSQL)
- **Externo:** Google Sheets API v4
- **Hosting:** Netlify
- **Package manager:** Bun

## Desarrollo

```sh
bun install
bun dev        # localhost:4321
bun build      # build producción → dist/
bun preview    # previsualizar build
```

## Entorno

Variables necesarias en `.env` o Netlify:

```
PUBLIC_VITE_SUPABASE_URL=
PUBLIC_VITE_SUPABASE_PUBLISHABLE_KEY=
PUBLIC_VITE_GOOGLESHEET_KEY=
```
