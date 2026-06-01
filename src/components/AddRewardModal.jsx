import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

// Modal para añadir una recompensa: selecciona personaje, mazmorra y stasis
export default function AddRewardModal({
  show,
  onClose,
  onSubmit,
  characters,
  dungeons,
  charValue,
  dungValue,
  stasisValue,
  onCharChange,
  onDungChange,
  onStasisChange,
}) {
  if (!show) return null;

  const selectedChar = characters.find((c) => c.id === parseInt(charValue)) || null;
  const selectedDung = dungeons.find((d) => d.id === parseInt(dungValue)) || null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0d2733] rounded-lg p-6 w-full max-w-md space-y-4 border border-gray-600"
      >
        <h3 className="text-lg font-semibold">Nueva recompensa</h3>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Personaje
          </label>
          <Combobox
            items={characters}
            value={selectedChar}
            onValueChange={(item) => onCharChange(item ? item.id.toString() : "")}
            itemToStringLabel={(item) =>
              `${item.char} — ${item.class} (${item.charrole}) [${item.player}]`
            }
            itemToStringValue={(item) => item.id.toString()}
            required
          >
            <ComboboxInput placeholder="Buscar personaje..." />
            <ComboboxContent>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.char} — {item.class} ({item.charrole}) [{item.player}]
                  </ComboboxItem>
                )}
              </ComboboxList>
              <ComboboxEmpty>No encontrado</ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Mazmorra</label>
          <Combobox
            items={dungeons}
            value={selectedDung}
            onValueChange={(item) => onDungChange(item ? item.id.toString() : "")}
            itemToStringLabel={(item) => item.name}
            itemToStringValue={(item) => item.id.toString()}
            required
          >
            <ComboboxInput placeholder="Buscar mazmorra..." />
            <ComboboxContent>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
              <ComboboxEmpty>No encontrado</ComboboxEmpty>
            </ComboboxContent>
          </Combobox>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Stasis</label>
          <select
            value={stasisValue}
            onChange={(e) => onStasisChange(parseInt(e.target.value))}
            required
            className="w-full bg-[#163544] border border-gray-600 rounded px-3 py-2 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-orange-400 hover:bg-orange-300 rounded font-medium text-black"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
