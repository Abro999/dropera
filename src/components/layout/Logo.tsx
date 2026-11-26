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
          <stop offset="0" stopColor="#14214a" />
          <stop offset="1" stopColor="#0b1530" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#dropera-logo-bg)" />
      <path
        d="M12.5 10.5h7.8c5.2 0 9.2 3.9 9.2 9s-4 9-9.2 9h-7.8v-18z"
        fill="none"
        stroke="#ffb020"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="28.5" cy="11" r="2.4" fill="#0a7c76" />
    </svg>
  );
}
