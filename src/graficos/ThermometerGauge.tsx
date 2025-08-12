import React from "react";
import { useSpring, animated, config } from "@react-spring/web";

interface ThermometerGaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
}

const ThermometerGauge: React.FC<ThermometerGaugeProps> = ({
  value,
  min = -10,
  max = 40,
  size = 260,
}) => {
  const clamped = Math.max(min, Math.min(max, value));
  const normalized = (clamped - min) / (max - min);

  const { animatedValue, fillPercent } = useSpring({
    from: { animatedValue: min, fillPercent: 0 },
    to: { animatedValue: clamped, fillPercent: normalized },
    config: config.molasses,
  });

  const tubeWidth = size * 0.15;
  const tubeHeight = size * 0.7;
  const tubeX = 0;
  const tubeY = size * 0.15;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        maxWidth: size + 120,
      }}
    >
      <svg
        width={tubeWidth}
        height={size}
        viewBox={`0 0 ${tubeWidth} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ flexShrink: 0 }}
      >
        <rect
          x={tubeX}
          y={tubeY}
          width={tubeWidth}
          height={tubeHeight}
          rx={tubeWidth / 2}
          ry={tubeWidth / 2}
          fill="#eee"
          stroke="#ccc"
          strokeWidth={2}
        />
        <animated.rect
          x={tubeX}
          y={fillPercent.to((fp) => tubeY + tubeHeight * (1 - fp))}
          width={tubeWidth}
          height={fillPercent.to((fp) => tubeHeight * fp)}
          rx={tubeWidth / 2}
          ry={tubeWidth / 2}
          fill="url(#gradient)"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>

      <animated.div
        style={{
          fontSize: size * 0.3,
          fontWeight: "700",
          fontFamily: "'Courier New', Courier, monospace",
          color: "#0f172a",
          userSelect: "none",
          minWidth: 100,
          textAlign: "center",
          border: "2px solid #0f172a",
          borderRadius: 8,
          padding: "8px 12px",
          background: "#f9fafb",
          boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
        }}
      >
        {animatedValue.to((val) => `${val.toFixed(0)}°C`)}
      </animated.div>
    </div>
  );
};

export default ThermometerGauge;
