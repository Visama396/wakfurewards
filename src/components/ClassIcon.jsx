/** Mapeo de nombre de clase a su ID numérico en el CDN de wakassets */
const CLASS_ICONS = {
  feca: 1,
  osa: 2,
  anu: 3,
  sram: 4,
  xelor: 5,
  zurka: 6,
  eni: 7,
  yop: 8,
  ocra: 9,
  sadida: 10,
  sacro: 11,
  panda: 12,
  tyma: 13,
  zobal: 14,
  ugi: 15,
  steamer: 16,
  selo: 18,
  hiper: 19,
};

/**
 * Muestra el ícono de una clase desde el CDN de wakassets.
 * El ID se compone como: NN_G — donde NN es el número de clase (2 dígitos)
 * y G es el género (0 masculino, 1 femenino).
 * Fallback a un cuadrado gris si la clase no está mapeada.
 */
export default function ClassIcon({ cls, gender }) {
  const num = CLASS_ICONS[cls];
  if (!num)
    return (
      <span className="size-8 inline-block rounded bg-gray-700 align-middle" />
    );
  const id = `${String(num).padStart(2, "0")}${gender ?? 0}`;
  return (
    <img
      src={`https://vertylo.github.io/wakassets/emoteIconsPlayers/${id}.png`}
      alt={cls}
      className="size-8 inline-block rounded align-middle"
    />
  );
}
