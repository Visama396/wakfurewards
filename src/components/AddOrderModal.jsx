import { useState, useMemo } from "react";
import { X, RefreshCw } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import itemsLocal from "../data/items.json";
import recipeResults from "../data/recipeResults.json";
import recipes from "../data/recipes.json";
import recipeIngredients from "../data/recipeIngredients.json";
export default function AddOrderModal({ show, onClose, onSubmit }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEM_ICON_BASE =
    "https://raw.githubusercontent.com/Vertylo/wakassets/main/items/";
  const eliminarAcentos = (str) =>
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
  const filteredItems = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const queryLimpia = eliminarAcentos(searchQuery.toLowerCase());
    return itemsLocal
      .filter((item) => {
        const nombreEs = item?.title?.es || item?.title?.fr || "";
        return eliminarAcentos(nombreEs.toLowerCase()).includes(queryLimpia);
      })
      .slice(0, 30);
  }, [searchQuery]);
  if (!show) return null;
  const previewGfxId =
    selectedItem?.definition?.item?.graphicParameters?.gfxId || 0;
  const previewLevel = selectedItem?.definition?.item?.level || 0;
  const previewName = selectedItem?.title?.es || selectedItem?.title?.fr || "";
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!selectedItem) return;
    const targetItemId = selectedItem.definition?.item?.id || selectedItem.id;
    const relacionResultado = recipeResults.find(
      (r) => r.productedItemId === targetItemId,
    );
    let materialesCalculados = [];
    if (relacionResultado) {
      const recipeId = relacionResultado.recipeId;
      const recetaBase = recipes.find((r) => r.id === recipeId);
      if (recetaBase) {
        materialesCalculados = recipeIngredients
          .filter((i) => i.recipeId === recipeId)
          .map((ing) => {
            const infoIngrediente = itemsLocal.find(
              (it) => (it.definition?.item?.id || it.id) === ing.itemId,
            );
            return {
              material_item_id: ing.itemId,
              material_name:
                infoIngrediente?.title?.es ||
                infoIngrediente?.title?.fr ||
                "Recurso",
              qty_needed: ing.quantity,
              is_rare: true,
              resource_type: 0,
            };
          });
      }
    }
    if (materialesCalculados.length === 0) {
      materialesCalculados = [
        {
          material_item_id: 1723,
          material_name: "Hierro primitivo",
          qty_needed: 10,
          is_rare: true,
          resource_type: 7,
        },
      ];
    }
    onSubmit({
      itemId: targetItemId,
      name: previewName,
      level: previewLevel,
      typeId: selectedItem.definition?.item?.baseParameters?.itemTypeId || 0,
      gfxId: previewGfxId,
      quantity: quantity,
      materialsList: materialesCalculados,
    });
    setSelectedItem(null);
    setQuantity(1);
    setSearchQuery("");
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0d2733] border border-gray-700/60 w-[40vw] min-w-[450px] max-w-[90vw] rounded-xl shadow-2xl flex flex-col overflow-hidden text-white transition-all duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-700/40 bg-[#0a1f29]">
          <h3 className="text-base font-bold text-orange-300 tracking-wide">
            Añadir Nuevo Pedido de Crafteo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1.5 bg-gray-800/20 rounded-md hover:bg-gray-800/50"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Buscar en el Catálogo de Wakfu:
            </label>
            <Combobox
              items={filteredItems}
              value={selectedItem}
              onValueChange={(item) => {
                setSelectedItem(item);
                if (item)
                  setSearchQuery(item.title?.es || item.title?.fr || "");
              }}
              itemToStringLabel={(item) =>
                `${item?.title?.es || item?.title?.fr} (nv. ${item?.definition?.item?.level || 0})`
              }
              itemToStringValue={(item) =>
                (item?.definition?.item?.id || item?.id)?.toString()
              }
            >
              <ComboboxInput
                placeholder="Escribe el nombre del objeto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm py-3 px-4 bg-[#163544] border-gray-600 focus:border-orange-300 font-medium"
              />
              <ComboboxContent>
                <ComboboxList>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const itemGfxId =
                        item.definition?.item?.graphicParameters?.gfxId || 0;
                      return (
                        <ComboboxItem
                          key={item.definition?.item?.id || item.id}
                          value={item}
                        >
                          <div className="flex items-center justify-between w-full gap-4 py-2 px-1">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="size-8 bg-[#0d2733] rounded-md flex items-center justify-center shrink-0 border border-gray-700/60 p-0.5 overflow-hidden shadow-md">
                                {itemGfxId !== 0 ? (
                                  <img
                                    src={`${ITEM_ICON_BASE}${itemGfxId}.png`}
                                    alt=""
                                    className="size-full object-contain"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="size-full bg-slate-800 rounded" />
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-200 truncate">
                                {item.title?.es || item.title?.fr}
                              </span>
                            </div>
                            <span className="text-gray-300 text-xs font-bold shrink-0 bg-[#0a1f29] px-2.5 py-1 rounded border border-gray-800/60 shadow-sm">
                              Nivel {item.definition?.item?.level || 0}
                            </span>
                          </div>
                        </ComboboxItem>
                      );
                    })
                  ) : (
                    <ComboboxEmpty className="text-sm py-5 text-gray-400 italic">
                      No se encontraron objetos en el catálogo
                    </ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          {selectedItem && (
            <div className="bg-[#112d3b] border border-orange-400/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-14 bg-[#0d2733] rounded-lg flex items-center justify-center shrink-0 border border-gray-700 p-1 shadow-inner">
                  {previewGfxId !== 0 ? (
                    <img
                      src={`${ITEM_ICON_BASE}${previewGfxId}.png`}
                      alt={previewName}
                      className="size-full object-contain"
                    />
                  ) : (
                    <div className="size-full bg-slate-800 rounded-md" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-orange-200 truncate">
                    {previewName}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Nivel Requerido:{" "}
                    <span className="text-yellow-400 font-semibold">
                      {previewLevel}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedItem(null);
                  setSearchQuery("");
                }}
                className="flex items-center gap-1.5 text-xs bg-[#163544] hover:bg-red-950/40 text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-gray-700/60 transition-all cursor-pointer font-medium"
              >
                <RefreshCw size={12} />
                Cambiar
              </button>
            </div>
          )}
          <div className="flex items-center gap-5 mt-1">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Cantidad:
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full bg-[#163544] border border-gray-600 text-white rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:border-orange-300 text-center h-[46px]"
              />
            </div>
            <div className="flex items-end h-full pt-6">
              <button
                type="submit"
                disabled={!selectedItem}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-bold px-7 rounded-md cursor-pointer h-[46px] shadow-lg flex items-center justify-center whitespace-nowrap tracking-wide"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
