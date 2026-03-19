export function ToothIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tooth body */}
      <path
        d="M100 20C65 20 40 45 35 80C30 115 40 140 50 165C60 190 65 220 70 240C72 248 78 248 80 240C85 215 90 195 100 180C110 195 115 215 120 240C122 248 128 248 130 240C135 220 140 190 150 165C160 140 170 115 165 80C160 45 135 20 100 20Z"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Shine highlight */}
      <path
        d="M80 50C75 60 72 75 73 90"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M75 55C73 60 72 68 72 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
}
