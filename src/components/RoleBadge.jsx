import { ROLE_COLORS } from "@/lib/constants";

export default function RoleBadge({ role }) {
  return (
    <span
      className={`px-1.5 rounded text-white text-[10px] ${ROLE_COLORS[role] || "bg-gray-500"}`}
    >
      {role}
    </span>
  );
}
