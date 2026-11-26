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
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#ffb020"
      >
        D
      </text>
    </svg>
  );
}
