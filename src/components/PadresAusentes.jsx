import ClassIcon from "@/components/ClassIcon";

export default function PadresAusentes({ characters = [], onTogglePadre }) {
  /** Personajes inactivos filtrados localmente */
  const padres = characters.filter((c) => c.charrole === "Padre Ausente");

  if (padres.length === 0) return null;

  return (
    <section className="bg-[#0d2733] rounded-lg p-4 opacity-60 shrink-0 mt-4">
      <h2 className="text-lg font-semibold text-gray-400 mb-2">
        Padre Ausente (Haz clic para activar)
      </h2>
      <div className="flex flex-wrap gap-2">
        {padres.map((c) => (
          <button
            key={c.id}
            onClick={() => onTogglePadre(c)}
            className="text-sm text-gray-400 flex items-center gap-1 bg-[#163544]/50 border border-gray-700/50 px-2.5 py-1 rounded hover:bg-green-950/40 hover:text-green-300 hover:border-green-800/40 hover:opacity-100 transition-all cursor-pointer group"
            title="Haga clic para devolver este personaje a la lista activa"
          >
            <ClassIcon cls={c.class} gender={c.gender} />
            <span className="group-hover:underline">
              {c.char} ({c.class})
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
