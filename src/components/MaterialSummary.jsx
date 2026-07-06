import { ITEM_ICON_BASE } from "@/lib/icons";
import itemsLocal from "../data/items.json";

/** Sidebar panel showing aggregated rare materials across all craft orders */
export default function MaterialSummary({ materials = [] }) {
  const materialList = [
    ...(Array.isArray(materials) ? materials : Object.values(materials || {})),
  ].sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col h-full text-white w-full min-h-0">
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-1.5 custom-scrollbar min-h-0">
        {materialList.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-xs italic border border-dashed border-gray-800 rounded-lg bg-[#0a1f29]/40">
            No hay recursos pendientes de recolección.
          </div>
        ) : (
          materialList.map((mat) => {
            const infoMatLocal = itemsLocal.find(
              (it) => (it.definition?.item?.id || it.id) === mat.id,
            );
            const matGfxId =
              infoMatLocal?.definition?.item?.graphicParameters?.gfxId || 21016;

            return (
              <div
                key={mat.id}
                className="flex items-center justify-between gap-2 bg-[#163544] border border-gray-700/40 p-2 rounded text-xs transition-colors hover:bg-[#1c4558]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 bg-[#0d2733] rounded flex items-center justify-center shrink-0 overflow-hidden border border-gray-700/30 p-0.5">
                    <img
                      src={`${ITEM_ICON_BASE}${matGfxId}.png`}
                      alt={mat.name}
                      className="size-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span
                    className="text-gray-300 font-medium truncate"
                    title={mat.name}
                  >
                    {mat.name}
                  </span>
                </div>
                <span className="text-yellow-400 font-bold bg-[#0d2733] px-2 py-0.5 rounded border border-gray-700/30 shrink-0">
                  x{mat.total}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
