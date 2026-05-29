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
          <select
            value={charValue}
            onChange={(e) => onCharChange(e.target.value)}
            required
            className="w-full bg-[#163544] border border-gray-600 rounded px-3 py-2 text-sm"
          >
            <option value="">Seleccionar...</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.char} — {c.class} ({c.charrole}) [{c.player}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Mazmorra</label>
          <select
            value={dungValue}
            onChange={(e) => onDungChange(e.target.value)}
            required
            className="w-full bg-[#163544] border border-gray-600 rounded px-3 py-2 text-sm"
          >
            <option value="">Seleccionar...</option>
            {dungeons.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
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
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded font-medium"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
