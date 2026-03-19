export function BeforeAfterVisual({
  variant = "whitening",
  className = "w-full h-full",
}: {
  variant?: "whitening" | "veneers" | "invisalign" | "implants";
  className?: string;
}) {
  const configs = {
    whitening: {
      beforeColor: "oklch(0.75 0.03 85)",
      afterColor: "oklch(0.97 0.005 85)",
      beforeOpacity: 0.6,
      afterOpacity: 0.15,
      label: "6 Shades Brighter",
    },
    veneers: {
      beforeColor: "oklch(0.70 0.04 60)",
      afterColor: "oklch(0.97 0.005 85)",
      beforeOpacity: 0.5,
      afterOpacity: 0.12,
      label: "Perfect Alignment",
    },
    invisalign: {
      beforeColor: "oklch(0.85 0.02 85)",
      afterColor: "oklch(0.97 0.005 85)",
      beforeOpacity: 0.4,
      afterOpacity: 0.1,
      label: "Straighter Smile",
    },
    implants: {
      beforeColor: "oklch(0.70 0.03 70)",
      afterColor: "oklch(0.97 0.005 85)",
      beforeOpacity: 0.5,
      afterOpacity: 0.12,
      label: "Natural Restoration",
    },
  };

  const config = configs[variant];

  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left side - Before */}
      <rect x="0" y="0" width="240" height="300" fill={config.beforeColor} opacity="0.15" />

      {/* Before teeth - slightly imperfect */}
      <g transform="translate(60, 100)">
        {[0, 28, 56, 84, 112].map((x, i) => {
          const offsets = [2, -1, 3, -2, 1];
          const heights = [42, 45, 40, 44, 41];
          return (
            <rect
              key={`before-${i}`}
              x={x}
              y={offsets[i]}
              width={22}
              height={heights[i]}
              rx={6}
              fill="currentColor"
              opacity={config.beforeOpacity}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.2"
              transform={`rotate(${offsets[i]} ${x + 11} ${offsets[i] + heights[i] / 2})`}
            />
          );
        })}
      </g>

      {/* Divider line */}
      <line
        x1="240"
        y1="30"
        x2="240"
        y2="270"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.15"
      />

      {/* Right side - After */}
      <rect x="240" y="0" width="240" height="300" fill={config.afterColor} opacity="0.2" />

      {/* After teeth - perfect alignment */}
      <g transform="translate(300, 105)">
        {[0, 26, 52, 78, 104].map((x, i) => (
          <rect
            key={`after-${i}`}
            x={x}
            y={0}
            width={22}
            height={42}
            rx={7}
            fill="currentColor"
            opacity={config.afterOpacity}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
        ))}
        {/* Sparkle on after side */}
        <g transform="translate(50, -25)" opacity="0.3">
          <line x1="0" y1="-8" x2="0" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="110" cy="-15" r="2.5" fill="currentColor" opacity="0.2" />
        <circle cx="-10" cy="50" r="2" fill="currentColor" opacity="0.15" />
      </g>

      {/* Labels */}
      <text
        x="120"
        y="260"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.3"
        fontSize="13"
        fontWeight="500"
        fontFamily="system-ui, sans-serif"
      >
        BEFORE
      </text>
      <text
        x="360"
        y="260"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.35"
        fontSize="13"
        fontWeight="500"
        fontFamily="system-ui, sans-serif"
      >
        AFTER
      </text>
    </svg>
  );
}
