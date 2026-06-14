import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SPELLS } from "@/data/dungeonGuides";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";

export default function DungeonGuideModal({ dungeonName, html, onClose }) {
  const tooltipRef = useRef(null);
  const hideTimer = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    function show(e) {
      const ref = e.target.closest(".spell-ref");
      if (!ref) return;
      if (hideTimer.current) clearTimeout(hideTimer.current);
      const rect = ref.getBoundingClientRect();
      const spell = SPELLS[ref.dataset.dungeon]?.[ref.dataset.spell];
      if (spell && tooltipRef.current) {
        tooltipRef.current.innerHTML = spell.html;
        tooltipRef.current.style.display = "block";
        tooltipRef.current.style.top = `${rect.bottom + 8}px`;
        tooltipRef.current.style.left = `${rect.left + rect.width / 2}px`;
      }
    }

    function hide() {
      hideTimer.current = setTimeout(() => {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
      }, 150);
    }

    el.addEventListener("mouseover", show);
    el.addEventListener("mouseout", hide);

    return () => {
      el.removeEventListener("mouseover", show);
      el.removeEventListener("mouseout", hide);
    };
  }, []);

  return (
    <Drawer open onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#0d2733] text-white border-gray-600 flex flex-col max-h-[85dvh] mt-0">
        <div className="flex items-center justify-between px-6 pt-6 pb-0 shrink-0">
          <h3 className="text-lg font-semibold text-orange-300">
            Guía: {dungeonName}
          </h3>
          <DrawerClose className="text-gray-400 hover:text-white text-xl cursor-pointer leading-none">
            ×
          </DrawerClose>
        </div>
        <div
          ref={contentRef}
          className="overflow-y-auto overflow-x-hidden vertical-scroll min-h-0 flex-1 px-6 pb-6 pt-4 guide-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </DrawerContent>

      {/* Portal al body para que el tooltip no se corte por el overflow-y-auto del contenido */}
      {createPortal(
        <div
          ref={tooltipRef}
          style={{ display: "none", transform: "translateX(-50%)" }}
          className="fixed z-[9999] bg-[#0d2733] text-white rounded-lg p-3 w-72 shadow-xl border border-gray-700 pointer-events-auto"
          onMouseEnter={() => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
          }}
          onMouseLeave={() => {
            hideTimer.current = setTimeout(() => {
              if (tooltipRef.current) tooltipRef.current.style.display = "none";
            }, 150);
          }}
        />,
        document.body,
      )}
    </Drawer>
  );
}
