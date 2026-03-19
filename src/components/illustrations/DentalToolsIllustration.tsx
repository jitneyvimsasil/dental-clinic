export function DentalToolsIllustration({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background decorative circles */}
      <circle cx="200" cy="250" r="190" fill="currentColor" opacity="0.03" />
      <circle
        cx="200"
        cy="250"
        r="160"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.06"
        strokeDasharray="4 8"
      />

      {/* Large central tooth */}
      <g transform="translate(130, 100)">
        <path
          d="M70 10C45 10 25 30 22 55C19 80 27 100 35 120C43 140 47 162 50 178C51 183 56 183 57 178C60 158 64 142 70 132C76 142 80 158 83 178C84 183 89 183 90 178C93 162 97 140 105 120C113 100 121 80 118 55C115 30 95 10 70 10Z"
          fill="currentColor"
          opacity="0.08"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.2"
        />
        {/* Tooth shine */}
        <path
          d="M52 32C48 40 46 52 47 62"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.15"
        />
      </g>

      {/* Dental mirror */}
      <g transform="translate(50, 280)" opacity="0.2">
        {/* Handle */}
        <rect
          x="15"
          y="60"
          width="6"
          height="100"
          rx="3"
          fill="currentColor"
          transform="rotate(-15 18 110)"
        />
        {/* Mirror head */}
        <circle
          cx="22"
          cy="50"
          r="22"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <circle cx="22" cy="50" r="16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Toothbrush */}
      <g transform="translate(270, 290)" opacity="0.2">
        {/* Handle */}
        <rect
          x="10"
          y="40"
          width="7"
          height="110"
          rx="3.5"
          fill="currentColor"
          transform="rotate(12 13 95)"
        />
        {/* Bristle head */}
        <rect
          x="2"
          y="10"
          width="24"
          height="38"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
          transform="rotate(12 14 29)"
        />
        {/* Bristle lines */}
        {[18, 24, 30, 36].map((y) => (
          <line
            key={y}
            x1="8"
            y1={y}
            x2="20"
            y2={y}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
            transform="rotate(12 14 29)"
          />
        ))}
      </g>

      {/* Floating sparkles */}
      <g opacity="0.2">
        <circle cx="80" cy="120" r="3" fill="currentColor" />
        <circle cx="320" cy="150" r="2.5" fill="currentColor" />
        <circle cx="340" cy="250" r="2" fill="currentColor" />
        <circle cx="65" cy="240" r="2" fill="currentColor" />

        {/* Plus sparkles */}
        <g transform="translate(310, 100)">
          <line x1="0" y1="-6" x2="0" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g transform="translate(90, 360)">
          <line x1="0" y1="-5" x2="0" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Shield / check mark for trust */}
      <g transform="translate(280, 340)" opacity="0.15">
        <path
          d="M20 5 L35 12 L35 25 C35 38 28 45 20 50 C12 45 5 38 5 25 L5 12 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
          strokeLinejoin="round"
        />
        <polyline
          points="12,26 18,32 28,20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
