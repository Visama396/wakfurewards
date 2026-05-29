// Mapeo de rol del personaje a color de fondo
const ROLE_BADGES = {
  CaC: "bg-red-700",
  DaD: "bg-blue-700",
  Support: "bg-green-700",
  xD: "bg-purple-700",
  "Padre Ausente": "bg-gray-600",
};

// Muestra una etiqueta con el rol del personaje
export default function RoleBadge({ role }) {
  return (
    <span
      className={`px-1.5 rounded text-white text-[10px] ${ROLE_BADGES[role] || "bg-gray-500"}`}
    >
      {role}
    </span>
  );
}
