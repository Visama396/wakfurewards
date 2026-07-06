import { useState } from "react";
import pkg from "../../package.json";
import { Menu, X } from "lucide-react";
import { useFetchDailies } from "@/lib/spreadsheet";
import { resetRewards } from "@/lib/db";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DailiesButton from "@/components/DailiesButton";
import RecompensasTab from "@/components/RecompensasTab";
import BuildsTab from "@/components/BuildsTab";
import GuiasTab from "@/components/GuiasTab";
import CompraTab from "@/components/CompraTab";

export default function App() {
  const { dailyDungeonNames, moduloxDungeonNames } = useFetchDailies();
  const [menuOpen, setMenuOpen] = useState(false);

  /** Returns a string like "Quedan X días" or "Quedan X horas" until end of month */
  function countdown() {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `Quedan ${days} días`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `Quedan ${hours} horas`;
  }

  const tabContentClass = "flex flex-col flex-1 min-h-0 mt-0 gap-0";

  return (
    <Tabs
      defaultValue="recompensas"
      className="p-4 space-y-6 flex flex-col min-h-screen lg:h-screen gap-0 overflow-hidden"
    >
      <header className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center justify-between sm:hidden">
          <h1 className="text-3xl font-bold">Capturadores de Sangre</h1>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-300 hover:text-white cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <h1 className="text-3xl font-bold">Capturadores de Sangre</h1>
          <div className="flex items-center gap-4">
            <TabsList variant="line">
              <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
              <TabsTrigger value="builds">Builds</TabsTrigger>
              <TabsTrigger value="guias">Guías</TabsTrigger>
              <TabsTrigger value="compra">Compra</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="hidden sm:flex flex-row items-center gap-4">
          <span className="text-sm text-gray-400">{countdown()}</span>
          <DailiesButton
            dailyDungeons={dailyDungeonNames}
            moduloxDungeons={moduloxDungeonNames}
          />
          <button
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white px-4 py-1 rounded hover:cursor-pointer"
            onClick={() => {
              if (window.confirm("¿Resetear todas las recompensas?")) resetRewards();
            }}
          >
            Resetear
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex sm:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/60 transition-opacity duration-200"
            style={{ animation: "fadeIn 150ms ease-out" }}
          />
          <nav
            onClick={(e) => e.stopPropagation()}
            className="relative ml-auto w-64 max-w-[75vw] h-full bg-[#0d2733] border-l border-gray-600 p-4 flex flex-col gap-8 overflow-y-auto"
            style={{ animation: "fadeIn 150ms ease-out" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Menú</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-3 my-6">
              <TabsList
                variant="line"
                className="flex-col items-stretch bg-transparent gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <TabsTrigger
                  value="recompensas"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Recompensas
                </TabsTrigger>
                <TabsTrigger
                  value="builds"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Builds
                </TabsTrigger>
                <TabsTrigger
                  value="guias"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Guías
                </TabsTrigger>
                <TabsTrigger
                  value="compra"
                  className="justify-start px-2 py-2 data-[state=active]:bg-[#163544]"
                >
                  Compra
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-gray-400">{countdown()}</span>
              <button
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors text-white px-4 py-2 rounded hover:cursor-pointer text-sm w-fit"
                onClick={() => {
                  if (window.confirm("¿Resetear todas las recompensas?")) {
                    resetRewards();
                    setMenuOpen(false);
                  }
                }}
              >
                Resetear
              </button>
              <DailiesButton
                dailyDungeons={dailyDungeonNames}
                moduloxDungeons={moduloxDungeonNames}
              />
            </div>
          </nav>
        </div>
      )}

      <TabsContent value="recompensas" className={tabContentClass}>
        <RecompensasTab
          highlightedDungeonNames={dailyDungeonNames}
          moduloxDungeonNames={moduloxDungeonNames}
        />
      </TabsContent>

      <TabsContent value="builds" className={tabContentClass}>
        <BuildsTab />
      </TabsContent>

      <TabsContent value="guias" className={tabContentClass}>
        <GuiasTab />
      </TabsContent>

      <TabsContent value="compra" className={tabContentClass}>
        <CompraTab />
      </TabsContent>

      <footer className="border-t border-gray-700/40 pt-4 pb-2 text-center text-xs text-gray-500 space-y-1">
        <p>
          Este sitio no está afiliado a Ankama. Wakfu es una marca registrada de
          Ankama.
        </p>
        <p>Desarrollado por Visama &amp; Peballo</p>
        <p>v{pkg.version}</p>
      </footer>

      <Toaster />
    </Tabs>
  );
}
