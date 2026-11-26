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
      <path
        fillRule="evenodd"
        fill="#ffb020"
        d="M12 8.5H19.2C27 8.5 32.5 13.5 32.5 20C32.5 26.5 27 31.5 19.2 31.5H12V8.5ZM16.2 12.8H18.8C23 12.8 26 15.8 26 20C26 24.2 23 27.2 18.8 27.2H16.2V12.8Z"
      />
      <circle cx="30" cy="10.5" r="2.6" fill="#0a7c76" />
    </svg>
  );
}
