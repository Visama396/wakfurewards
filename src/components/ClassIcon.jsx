// Mapeo de nombre de clase a número de clase
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

// Muestra el ícono de una clase usando el ID numérico + género
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
