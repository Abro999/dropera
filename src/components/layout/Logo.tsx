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
      <rect width="40" height="40" rx="10" fill="url(#dropera-logo-bg)" />
      <rect x="4" y="15.2" width="6.5" height="2.3" rx="1.15" fill="#0a7c76" />
      <rect x="6" y="19.9" width="6.5" height="2.3" rx="1.15" fill="#0a7c76" />
      <rect x="4" y="24.5" width="6.5" height="2.3" rx="1.15" fill="#0a7c76" />
      <path
        d="M16 15.5 L30 15.5 L31.6 31 L14.4 31 Z"
        fill="none"
        stroke="#fbfcff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19.8 15.5 V13.3 a3.2 3.2 0 0 1 6.4 0 V15.5"
        fill="none"
        stroke="#fbfcff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <text
        x="23"
        y="27.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="13.5"
        fill="#ffb020"
      >
        D
      </text>
    </svg>
  );
}
