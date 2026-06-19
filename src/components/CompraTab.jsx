import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import CraftFilter from "./CraftFilter";
import CraftCard from "./CraftCard";
import MaterialSummary from "./MaterialSummary";
import AddOrderModal from "./AddOrderModal";

export default function CompraTab() {
  const [jobFilter, setJobFilter] = useState("");
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [craftItems, setCraftItems] = useState([]);
  const [materialsMap, setMaterialsMap] = useState({});

  const jobs = [
    "Sastre",
    "Marroquinero",
    "Armero",
    "Maestro de Armas",
    "Joyero",
  ];

  useEffect(() => {
    async function loadCraftData() {
      try {
        const { data: crafts, error } = await supabase
          .from("wakfucrafts")
          .select("*, wakfucraft_materials(*)")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (crafts) {
          const procesados = crafts.map((c) => {
            return {
              id: c.id,
              itemId: c.item_id,
              name: c.name,
              level: c.level,
              job: (c.job || "Sastre").trim(),
              quantity: c.quantity,
              isPriority: c.is_priority,
              materials: (c.wakfucraft_materials || []).map((m) => ({
                id: m.id,
                material_item_id: m.material_item_id,
                material_name: m.material_name,
                qty_needed: m.qty_needed,
                is_rare: m.is_rare,
                resourceType: m.resource_type,
              })),
            };
          });

          setCraftItems(procesados);
          calcularMaterialesGlobales(procesados);
        }
      } catch (err) {
        console.error(
          "Error al cargar datos del panel de crafteo:",
          err.message,
        );
      }
    }

    loadCraftData();

    const channelCrafts = supabase
      .channel("wakfucrafts-local-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wakfucrafts" },
        () => loadCraftData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelCrafts);
    };
  }, []);

  function calcularMaterialesGlobales(items = []) {
    const acumulador = {};
    items.forEach((item) => {
      const mult = item.quantity || 1;
      (item.materials || []).forEach((mat) => {
        if (mat.is_rare) {
          const clave = mat.material_item_id;
          if (!acumulador[clave]) {
            acumulador[clave] = {
              id: mat.material_item_id,
              name: mat.material_name,
              total: 0,
            };
          }
          acumulador[clave].total += mat.qty_needed * mult;
        }
      });
    });
    setMaterialsMap(acumulador);
  }

  async function handleTogglePriority(item) {
    await supabase
      .from("wakfucrafts")
      .update({ is_priority: !item.isPriority })
      .eq("id", item.id);
  }

  async function handleDeleteCraft(id) {
    const { error } = await supabase.from("wakfucrafts").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar el pedido");
    } else {
      toast.success("Pedido eliminado correctamente");
    }
  }

  async function handleCreateCraftOrder(datosModal) {
    try {
      const typeId = parseInt(datosModal.typeId);
      let oficioReal = "Sastre";

      const mapaCategorias = {
        103: "Joyero",
        120: "Joyero",
        132: "Sastre",
        134: "Sastre",
        138: "Sastre",
        119: "Marroquinero",
        133: "Marroquinero",
        218: "Marroquinero",
        136: "Armero",
        189: "Armero",
        101: "Maestro de Armas",
        108: "Maestro de Armas",
        110: "Maestro de Armas",
        111: "Maestro de Armas",
        112: "Maestro de Armas",
        113: "Maestro de Armas",
        114: "Maestro de Armas",
        115: "Maestro de Armas",
        117: "Maestro de Armas",
        223: "Maestro de Armas",
        253: "Maestro de Armas",
        254: "Maestro de Armas",
      };

      if (mapaCategorias[typeId]) {
        oficioReal = mapaCategorias[typeId];
      }

      const { data: nuevoCraft, error: errorCraft } = await supabase
        .from("wakfucrafts")
        .insert({
          item_id: datosModal.itemId,
          name: datosModal.name,
          level: datosModal.level,
          job: oficioReal,
          quantity: datosModal.quantity,
          is_priority: false,
        })
        .select()
        .single();

      if (errorCraft) throw errorCraft;

      const materialesParaInsertar = datosModal.materialsList.map((mat) => ({
        craft_id: nuevoCraft.id,
        material_item_id: mat.material_item_id,
        material_name: mat.material_name,
        qty_needed: mat.qty_needed,
        is_rare: mat.is_rare,
        resource_type: mat.resource_type,
      }));

      const { error: errorMat } = await supabase
        .from("wakfucraft_materials")
        .insert(materialesParaInsertar);

      if (errorMat) throw errorMat;

      toast.success(`Pedido de ${datosModal.name} añadido correctamente`);
    } catch (err) {
      toast.error("Error al guardar el pedido: " + err.message);
    }
  }

  const filteredItems = craftItems.filter((item) => {
    const matchesJob = jobFilter ? item.job === jobFilter : true;
    const matchesPriority = showPriorityOnly ? item.isPriority : true;
    return matchesJob && matchesPriority;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_340px] gap-4 items-stretch flex-1 min-h-0 text-white">
      <section className="bg-[#0d2733] rounded-lg pl-4 pt-4 pb-4 pr-0 flex flex-col h-0 min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0 pr-1.5">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-orange-300 pl-3">
              Lista de la Compra
            </h2>
            <CraftFilter
              jobs={jobs}
              currentFilter={jobFilter}
              onFilter={setJobFilter}
            />
          </div>

          <div className="flex items-center gap-4 shrink-0 pr-3">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPriorityOnly}
                onChange={(e) => setShowPriorityOnly(e.target.checked)}
                className="rounded bg-[#163a4a] border-gray-600 text-orange-400 size-4 cursor-pointer"
              />
              Mostrar prioritarios
            </label>

            <button
              onClick={() => setShowAddOrder(true)}
              className="text-xs bg-orange-400 hover:bg-orange-300 text-black font-semibold px-3 py-1.5 rounded transition-all cursor-pointer shadow-md"
            >
              AÑADIR NUEVO PEDIDO
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <CraftCard
                  key={item.id}
                  item={item}
                  onTogglePriority={handleTogglePriority}
                  onDelete={handleDeleteCraft}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm border border-dashed border-gray-700/60 rounded-lg mr-4 bg-[#0a1f29]/30">
              No hay pedidos que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>
      </section>

      <aside className="w-full flex flex-col min-h-0 bg-[#0a1f29] rounded-lg p-4 border border-gray-800/40">
        <h3 className="text-sm font-semibold text-orange-200 mb-3 shrink-0">
          Materiales Totales a Farmear
        </h3>
        <MaterialSummary materials={Object.values(materialsMap)} />
      </aside>

      <AddOrderModal
        show={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        onSubmit={handleCreateCraftOrder}
      />
    </div>
  );
}
