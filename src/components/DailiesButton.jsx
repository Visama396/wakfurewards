import { useState } from "react";
import { FileText } from "lucide-react";
import TooltipCell from "@/components/TooltipCell";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useIsFinePointer } from "@/lib/utils";

/**
 * Botón/info de rotaciones diarias.
 * Muestra mazmorras DJ y Modulox del día desde Google Sheets.
 * En desktop usa tooltip hover; en móvil usa collapsible expandible.
 */
export default function DailiesButton({
  dailyDungeons = new Set(),
  moduloxDungeons = new Set(),
}) {
  const isFinePointer = useIsFinePointer();
  const [open, setOpen] = useState(false);
  const dailyList = [...dailyDungeons].sort();
  const moduloxList = [...moduloxDungeons].sort();
  const hasDaily = dailyList.length > 0;
  const hasModulox = moduloxList.length > 0;

  const content = (
    <div className="text-xs space-y-2 max-w-56">
      {hasDaily && (
        <div>
          <p className="font-medium text-yellow-400 mb-0.5">◆ DJ Diarias</p>
          {dailyList.map((name) => (
            <p key={name} className="pl-3 text-gray-200">{name}</p>
          ))}
        </div>
      )}
      {hasModulox && (
        <div>
          <p className="font-medium text-sky-400 mb-0.5">◇ Modulox</p>
          {moduloxList.map((name) => (
            <p key={name} className="pl-3 text-gray-200">{name}</p>
          ))}
        </div>
      )}
      {!hasDaily && !hasModulox && (
        <p className="text-gray-400">No hay datos disponibles</p>
      )}
    </div>
  );

  if (isFinePointer) {
    return (
      <TooltipProvider delayDuration={300}>
        <TooltipCell content={content} side="bottom" align="center">
          <span className="flex items-center gap-1.5 text-xs bg-[#163a4a] hover:bg-[#1c495e] border border-gray-700/60 hover:border-orange-300/40 text-orange-300 px-2.5 py-1.5 rounded transition-all cursor-pointer font-medium select-none">
            <FileText size={14} />
            Diarias
          </span>
        </TooltipCell>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs bg-[#163a4a] hover:bg-[#1c495e] border border-gray-700/60 hover:border-orange-300/40 text-orange-300 px-2.5 py-1.5 rounded transition-all cursor-pointer font-medium select-none">
          <FileText size={14} />
          Diarias
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
}
