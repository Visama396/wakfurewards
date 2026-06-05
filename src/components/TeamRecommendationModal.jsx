import ClassIcon from "@/components/ClassIcon";
import RoleBadge from "@/components/RoleBadge";

function scoreColor(score) {
  if (score > 0) return "text-green-400";
  if (score < 0) return "text-red-400";
  return "text-gray-400";
}

function scoreLabel(score) {
  if (score > 0) return `+${score}`;
  return String(score);
}

export default function TeamRecommendationModal({
  dungeonName,
  result,
  onClose,
}) {
  if (!result) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0d2733] rounded-lg p-6 w-full max-w-2xl border border-gray-600 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-lg font-semibold text-orange-300">
            Equipo recomendado para {dungeonName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl cursor-pointer leading-none"
          >
            ×
          </button>
        </div>

        {result.explanation && (
          <p className="text-sm text-gray-400 mb-4 italic shrink-0">
            {result.explanation}
          </p>
        )}

        {result.error ? (
          <p className="text-red-400 text-sm">{result.error}</p>
        ) : (
          <div className="space-y-4 overflow-y-auto vertical-scroll min-h-0 pr-1">
            {result.teams.map((team, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {i === 0
                      ? "Mejor equipo"
                      : i === 1
                        ? "Alternativa"
                        : "Alternativa"}
                  </span>
                  <span className="text-sm text-yellow-400 font-mono">
                    Puntuación: {team.totalScore}
                  </span>
                </div>
                <div className="space-y-1">
                  {team.members.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between bg-[#163544] rounded px-3 py-1.5 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ClassIcon cls={c.class} gender={c.gender} />
                        <span className="truncate max-w-28">{c.char}</span>
                        <span className="text-gray-400 text-xs">{c.class}</span>
                        <RoleBadge role={c.charrole} />
                      </div>
                      <span className={`font-mono text-xs ${scoreColor(c.score)}`}>
                        {scoreLabel(c.score)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 self-end px-4 py-2 text-sm bg-orange-400 hover:bg-orange-300 rounded font-medium text-black cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
