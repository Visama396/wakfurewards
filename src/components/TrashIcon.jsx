/** Ícono SVG de papelera */
export default function TrashIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.35 15h5.3a1.5 1.5 0 001.485-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.074l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.713.787l-.275 5.5a.75.75 0 01-1.498-.074l.275-5.5a.75.75 0 01.787-.713z"
        clipRule="evenodd"
      />
    </svg>
  );
}
