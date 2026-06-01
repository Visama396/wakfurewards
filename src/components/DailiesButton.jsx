import { FileText } from "lucide-react";

export default function DailiesButton() {
  return (
    <a
      href="https://docs.google.com/spreadsheets/d/1YXdxmQC9U3Ux7AuNnT8Cm3DR7kp1YYHenWuU3eQ5wbY/edit?gid=1100218508#gid=1100218508"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-xs bg-[#163a4a] hover:bg-[#1c495e] border border-gray-700/60 hover:border-orange-300/40 text-orange-300 px-2.5 py-1.5 rounded transition-all cursor-pointer font-medium select-none"
    >
      <FileText size={14} />
      Diarias
    </a>
  );
}
