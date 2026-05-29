import ClassIcon from "./ClassIcon";
import RoleBadge from "./RoleBadge";

// Tarjeta de personaje pendiente con clase, rol y botón para añadir recompensa
export default function CharacterCard({ character, onAdd }) {
  return (
    <div className="bg-[#163544] rounded px-3 py-2 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="font-medium truncate flex items-center gap-1">
          <ClassIcon cls={character.class} gender={character.gender} />
          {character.char}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>{character.class}</span>
          <RoleBadge role={character.charrole} />
        </div>
      </div>
      <button
        onClick={() => onAdd(character.id)}
        className="shrink-0 text-xs bg-blue-600 hover:bg-blue-500 rounded px-2 py-1"
      >
        +Añadir
      </button>
    </div>
  );
}
