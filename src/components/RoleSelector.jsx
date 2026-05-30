export default function RoleSelector({
  availableRoles = [],
  roleFilter,
  setRoleFilter,
}) {
  return (
    <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 horizontal-scroll">
      <button
        onClick={() => setRoleFilter("")}
        className={`px-2.5 py-1 text-xs rounded transition-all border ${
          roleFilter === ""
            ? "bg-orange-400 text-black font-medium scale-105 border-transparent"
            : "bg-[#163a4a] text-gray-300 border-gray-700/40 hover:bg-[#1c495e]"
        }`}
      >
        Todos
      </button>
      {availableRoles.map((role) => {
        const isActive = roleFilter === role;

        const roleClasses = {
          CaC: isActive
            ? "bg-red-700 text-white border-transparent scale-105 shadow-md font-semibold"
            : "bg-red-950/40 text-red-300 border-red-800/30 hover:bg-red-900/30",
          DaD: isActive
            ? "bg-blue-700 text-white border-transparent scale-105 shadow-md font-semibold"
            : "bg-blue-950/40 text-blue-300 border-blue-800/30 hover:bg-blue-900/30",
          Support: isActive
            ? "bg-green-700 text-white border-transparent scale-105 shadow-md font-semibold"
            : "bg-green-950/40 text-green-300 border-green-800/30 hover:bg-green-900/30",
          xD: isActive
            ? "bg-purple-700 text-white border-transparent scale-105 shadow-md font-semibold"
            : "bg-purple-950/40 text-purple-300 border-purple-800/30 hover:bg-purple-900/30",
        };

        const currentClass =
          roleClasses[role] ||
          (isActive
            ? "bg-gray-500 text-white"
            : "bg-gray-900/40 text-gray-400 border-gray-700");

        return (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-2.5 py-1 text-xs rounded border transition-all ${currentClass}`}
          >
            {role}
          </button>
        );
      })}
    </div>
  );
}
