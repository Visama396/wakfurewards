// Mapeo de nombre de mazmorra a su ícono personalizado
const DUNGEON_ICONS = {
  Tejaroxores: "/cojonidas.webp",
  "Or'Hodruin": "/saurhon.webp",
};

// Muestra el ícono de una mazmorra si tiene imagen personalizada
export default function DungeonIcon({ name }) {
  const src = DUNGEON_ICONS[name];
  if (!src)
    return (
      <span className="size-8 inline-block rounded bg-gray-700 align-middle" />
    );
  return (
    <img
      src={src}
      alt={name}
      className="size-8 inline-block rounded align-middle"
    />
  );
}
