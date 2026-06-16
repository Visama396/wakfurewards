/** Opciones de estasis (1-10) para selects de recompensa */
export const STASIS_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

/** Colores de fondo para cada rol en las etiquetas RoleBadge */
export const ROLE_COLORS = {
  mele: "bg-red-700",
  distancia: "bg-blue-700",
  apoyo: "bg-green-700",
  xD: "bg-purple-700",
  "Padre Ausente": "bg-gray-600",
} as const;
