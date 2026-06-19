import { Star, Trash2 } from "lucide-react";
import TooltipCell from "@/components/TooltipCell";
import { TooltipProvider } from "@/components/ui/tooltip";
import itemsLocal from "../data/items.json";
export default function CraftCard({ item, onTogglePriority, onDelete }) {
  const ITEM_ICON_BASE =
    "https://raw.githubusercontent.com/Vertylo/wakassets/main/items/";
  const localItemInfo = itemsLocal.find(
    (it) => (it.definition?.item?.id || it.id) === item.itemId,
  );
  const mainGfxId =
    localItemInfo?.definition?.item?.graphicParameters?.gfxId || item.itemId;
  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-[#163544] rounded-lg p-3 border border-gray-700/40 flex flex-col justify-between gap-3 relative group text-white">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-10 bg-[#0d2733] rounded flex items-center justify-center shrink-0 border border-gray-700/50 p-1 overflow-hidden">
              <img
                src={`${ITEM_ICON_BASE}${mainGfxId}.png`}
                alt={item.name}
                className="size-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `${ITEM_ICON_BASE}21016.png`;
                }}
              />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={`${ITEM_ICON_BASE}${mainGfxId}.png`}
                  alt=""
                  className="size-3.5 object-contain shrink-0 opacity-80"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <h3 className="font-medium text-sm text-gray-200 truncate">
                  {item.name}
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Cantidad:{" "}
                <span className="text-orange-300 font-bold">
                  {item.quantity}
                </span>{" "}
                — <span className="italic text-orange-400/80">{item.job}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onTogglePriority(item)}
              className={`p-1 rounded hover:bg-[#1c495e] transition-all cursor-pointer ${item.isPriority ? "text-yellow-400 scale-110" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Star
                size={15}
                fill={item.isPriority ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(`¿Quieres eliminar el pedido de ${item.name}?`)
                )
                  onDelete(item.id);
              }}
              className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
        <div className="bg-[#1e4456]/40 border border-gray-700/30 rounded p-1.5 flex items-center gap-2 overflow-x-auto horizontal-scroll min-h-[36px]">
          {(item.materials || []).map((mat, idx) => {
            const mId = mat.material_item_id;
            const totalMaterialPedido = mat.qty_needed * (item.quantity || 1);
            return (
              <TooltipCell
                key={idx}
                content={
                  <div className="text-xs space-y-0.5">
                    <p className="font-medium text-orange-300">
                      {mat.material_name}
                    </p>
                    <p className="text-gray-400">
                      Total:{" "}
                      <span className="text-yellow-400 font-bold">
                        {totalMaterialPedido}
                      </span>
                    </p>
                  </div>
                }
              >
                <div className="flex items-center gap-1 shrink-0 bg-[#0d2733]/70 px-1.5 py-0.5 rounded border border-gray-700/30 cursor-default select-none">
                  <img
                    src={`${ITEM_ICON_BASE}${mId}.png`}
                    alt=""
                    className="size-5 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `${ITEM_ICON_BASE}21016.png`;
                    }}
                  />
                  <span className="text-[10px] font-bold text-gray-300">
                    {totalMaterialPedido}
                  </span>
                </div>
              </TooltipCell>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
