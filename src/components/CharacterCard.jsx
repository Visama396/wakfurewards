import ClassIcon from "@/components/ClassIcon";
import RoleBadge from "@/components/RoleBadge";
import TooltipCell from "@/components/TooltipCell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EyeOff } from "lucide-react";

export default function CharacterCard({
  character,
  onAdd,
  dungeons = [],
  rewardMap = {},
  onTogglePadre,
}) {
  const completedDungs = new Set(
    (rewardMap[character.id] || []).map((r) => r.dung),
  );
  const uncompletedDungeons = dungeons.filter((d) => !completedDungs.has(d.id));

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-[#163544] rounded px-3 py-2 flex items-center justify-between gap-2 group/card">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <TooltipCell
              side="right"
              content={
                <div className="text-xs space-y-0.5">
                  {uncompletedDungeons.length > 0 ? (
                    <>
                      <p className="font-medium text-orange-300">
                        Mazmorras pendientes ({uncompletedDungeons.length}):
                      </p>
                      {uncompletedDungeons.map((d) => (
                        <p key={d.id}>{d.name}</p>
                      ))}
                    </>
                  ) : (
                    <p className="text-green-400">¡Todo completado este mes!</p>
                  )}
                </div>
              }
            >
              <div className="font-medium truncate flex items-center gap-1 cursor-default select-none w-fit max-w-full hover:text-orange-200 transition-colors">
                <ClassIcon cls={character.class} gender={character.gender} />
                {character.char}
              </div>
            </TooltipCell>

            {/* Botón del ojo tachado oculto por defecto, aparece al pasar el ratón por la tarjeta */}
            <button
              onClick={() => onTogglePadre(character)}
              className="opacity-0 group-hover/card:opacity-40 hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-0.5 rounded cursor-pointer"
              title="Ocultar personaje (Enviar a Padre Ausente)"
            >
              <EyeOff size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <span>{character.class}</span>
            <RoleBadge role={character.charrole} />
          </div>
        </div>

        <button
          onClick={() => onAdd(character.id)}
          className="shrink-0 text-xs bg-blue-600 hover:bg-blue-500 rounded px-2 py-1 cursor-pointer"
        >
          +Añadir
        </button>
      </div>
    </TooltipProvider>
  );
}
