export function SmileIllustration({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="200" cy="200" r="180" fill="currentColor" opacity="0.04" />
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />

      {/* Inner circle */}
      <circle cx="200" cy="200" r="140" fill="currentColor" opacity="0.03" />
      <circle
        cx="200"
        cy="200"
        r="140"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
        strokeDasharray="8 6"
      />

      {/* Smile arc */}
      <path
        d="M120 200 Q200 300 280 200"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.2"
      />

      {/* Upper teeth row */}
      {[140, 165, 190, 210, 235, 260].map((x, i) => (
        <rect
          key={`upper-${i}`}
          x={x - 10}
          y={175}
          width={20}
          height={28}
          rx={6}
          fill="currentColor"
          opacity={0.08 + i * 0.01}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity={0.15}
        />
      ))}

      {/* Lower teeth row */}
      {[145, 170, 195, 215, 240, 255].map((x, i) => (
        <rect
          key={`lower-${i}`}
          x={x - 8}
          y={208}
          width={17}
          height={24}
          rx={5}
          fill="currentColor"
          opacity={0.06 + i * 0.01}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity={0.12}
        />
      ))}

      {/* Sparkle decorations */}
      <g opacity="0.25">
        {/* Top-right sparkle */}
        <line x1="310" y1="90" x2="310" y2="110" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="300" y1="100" x2="320" y2="100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* Top-left sparkle */}
        <line x1="95" y1="110" x2="95" y2="125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="88" y1="117.5" x2="102" y2="117.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Bottom-right sparkle */}
        <circle cx="330" cy="260" r="3" fill="currentColor" />
        <circle cx="85" cy="270" r="2.5" fill="currentColor" />
        <circle cx="310" cy="150" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}
