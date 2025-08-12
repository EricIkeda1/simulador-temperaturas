import React from "react";

interface ThermometerGaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
}

const ThermometerGauge: React.FC<ThermometerGaugeProps> = ({ value, min = -10, max = 40, size = 260 }) => {
  const clamped = Math.max(min, Math.min(max, value));
  const percent = (clamped - min) / (max - min);

  const cx = size / 2;
  const cy = size * 0.62;
  const r = size * 0.36;
  const viewBoxH = Math.round(size * 0.75);
  const strokeW = Math.max(8, Math.round(size * 0.06));

  const polarToCartesian = (cxN: number, cyN: number, rN: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return { x: cxN + rN * Math.cos(angleRad), y: cyN + rN * Math.sin(angleRad) };
  };

  const describeArc = (start: number, end: number) => {
    const startPt = polarToCartesian(cx, cy, r, end);
    const endPt = polarToCartesian(cx, cy, r, start);
    const largeArcFlag = Math.abs(end - start) <= 180 ? "0" : "1";
    return `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArcFlag} 0 ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)}`;
  };

  const endAngleActive = 180 - percent * 180;
  const bgPath = describeArc(180, 0);
  const activePath = describeArc(180, endAngleActive);

  const minPos = polarToCartesian(cx, cy, r, 180);
  const maxPos = polarToCartesian(cx, cy, r, 0);
  const pointerPos = polarToCartesian(cx, cy, r - strokeW * 0.5, endAngleActive);

  return (
    <div className="gauge-wrapper" style={{ maxWidth: `${size}px` }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${viewBoxH}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g1" gradientUnits="userSpaceOnUse" x1={cx - r} y1={cy} x2={cx + r} y2={cy}>
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        <path d={bgPath} strokeWidth={strokeW} fill="none" stroke="#e8eef6" strokeLinecap="round" />
        <path d={activePath} strokeWidth={strokeW} fill="none" stroke="url(#g1)" strokeLinecap="round" />

        <line x1={cx} y1={cy} x2={pointerPos.x} y2={pointerPos.y} stroke="#213046" strokeWidth={Math.max(2, Math.round(size * 0.02))} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={Math.max(3, Math.round(strokeW * 0.26))} fill="#213046" />

        <text x={cx - size * 0.06} y={cy - r * 0.55} fontSize={Math.round(size * 0.16)} fontWeight="700" fill="#0f172a" textAnchor="middle" dominantBaseline="middle">
          {Math.round(clamped)}
        </text>
        <text x={cx + size * 0.04} y={cy - r * 0.68} fontSize={Math.round(size * 0.08)} fill="#0f172a" textAnchor="middle" dominantBaseline="middle">
          °
        </text>
        <text x={cx + size * 0.15} y={cy - r * 0.55} fontSize={Math.round(size * 0.16)} fontWeight="700" fill="#0f172a" textAnchor="middle" dominantBaseline="middle">
          C
        </text>

        <text x={minPos.x - size * 0.04} y={minPos.y + size * 0.07} fontSize={Math.round(size * 0.08)} fill="#6b7280" textAnchor="middle" dominantBaseline="middle">
          {min}°
        </text>
        <text x={maxPos.x + size * 0.04} y={maxPos.y + size * 0.07} fontSize={Math.round(size * 0.08)} fill="#6b7280" textAnchor="middle" dominantBaseline="middle">
          {max}°
        </text>
      </svg>
    </div>
  );
};

export default ThermometerGauge;
