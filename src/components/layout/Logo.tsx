export function Logo({ className = "w-8 h-8 md:w-9 md:h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="DropEra"
    >
      <defs>
        <linearGradient id="dropera-logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#17275a" />
          <stop offset="1" stopColor="#0b1530" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#dropera-logo-bg)" />
      <rect x="5" y="14" width="7" height="2.4" rx="1.2" fill="#0a7c76" />
      <rect x="7" y="18.8" width="7" height="2.4" rx="1.2" fill="#0a7c76" />
      <rect x="5" y="23.6" width="7" height="2.4" rx="1.2" fill="#0a7c76" />
      <path
        d="M15 15 L29 15 L31 32 L13 32 Z"
        fill="none"
        stroke="#fbfcff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 15 V12.5 a3 3 0 0 1 6 0 V15"
        fill="none"
        stroke="#fbfcff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="22"
        y="28.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="13"
        fill="#ffb020"
      >
        D
      </text>
    </svg>
  );
}
