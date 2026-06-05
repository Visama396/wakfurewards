import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SPELLS } from "@/data/dungeonGuides";

export default function DungeonGuideModal({ dungeonName, html, onClose }) {
  const tooltipRef = useRef(null);
  const hideTimer = useRef(null);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const [swipeY, setSwipeY] = useState(0);
  const startY = useRef(0);

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

  function onTouchStart(e) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setSwipeY(dy);
  }

  function onTouchEnd() {
    if (swipeY > 100) {
      onClose();
    } else {
      setSwipeY(0);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{ transform: swipeY > 0 ? `translateY(${swipeY}px)` : "" }}
        className="bg-[#0d2733] rounded-t-2xl sm:rounded-lg p-6 w-full sm:w-1/2 border border-gray-600 max-h-[85vh] flex flex-col transition-transform duration-200 ease-out"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-lg font-semibold text-orange-300">
            Guía: {dungeonName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl cursor-pointer leading-none"
          >
            ×
          </button>
        </div>
        <div
          ref={contentRef}
          className="overflow-y-auto overflow-x-hidden vertical-scroll min-h-0 pr-1 guide-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <button
          onClick={onClose}
          className="mt-4 self-end px-4 py-2 text-sm bg-orange-400 hover:bg-orange-300 rounded font-medium text-black cursor-pointer"
        >
          Cerrar
        </button>
      </div>

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
    </div>
  );
}
