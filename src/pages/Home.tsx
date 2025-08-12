import React, { useEffect, useRef, useState } from "react";
import type { TemperatureRecord } from "../ts/types";
import { getTemperatures, saveTemperature, clearTemperatures } from "../ts/storage";
import { Line } from "react-chartjs-2";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const ThermometerGauge: React.FC<{
  value: number;
  min?: number;
  max?: number;
  size?: number;
}> = ({ value, min = -10, max = 40, size = 220 }) => {
  const clamped = Math.max(min, Math.min(max, value));
  const percent = (clamped - min) / (max - min);

  const cx = size / 2;
  const cy = size / 1.12;
  const r = size * 0.36;

  const polarToCartesian = (cxN: number, cyN: number, rN: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cxN + rN * Math.cos(angleRad),
      y: cyN + rN * Math.sin(angleRad),
    };
  };

  const describeArc = (start: number, end: number) => {
    const startPt = polarToCartesian(cx, cy, r, end);
    const endPt = polarToCartesian(cx, cy, r, start);
    const largeArcFlag = Math.abs(end - start) <= 180 ? "0" : "1";
    return `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(
      2
    )} 0 ${largeArcFlag} 0 ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)}`;
  };

  const endAngleActive = 180 - percent * 180;
  const bgPath = describeArc(180, 0);
  const activePath = describeArc(180, endAngleActive);

  return (
    <div className="gauge-wrapper" style={{ width: size }}>
      <svg width={size} height={size / 1.12} viewBox={`0 0 ${size} ${size / 1.12}`}>
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        <path d={bgPath} strokeWidth={14} fill="none" stroke="#e6eaf2" strokeLinecap="round" />
        <path d={activePath} strokeWidth={14} fill="none" stroke="url(#g1)" strokeLinecap="round" />

        <text x={cx} y={cy - r - 6} dominantBaseline="central" textAnchor="middle">
          {Math.round(clamped)}°C
        </text>

        <text x={cx - r} y={cy + 18} dominantBaseline="middle" textAnchor="start">
          {min}°
        </text>
        <text x={cx + r} y={cy + 18} dominantBaseline="middle" textAnchor="end">
          {max}°
        </text>
      </svg>
    </div>
  );
};

const Home: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>(getTemperatures);
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleAdd = (temp?: number) => {
    const temperatureValue = temp ?? value;
    if (Number.isNaN(temperatureValue)) return;
    const newRecord: TemperatureRecord = {
      id: genId(),
      value: temperatureValue,
      date: new Date().toISOString(),
    };
    saveTemperature(newRecord);
    setValue(0);
    setTemperatures(getTemperatures());
  };

  const handleClear = () => {
    if (window.confirm("Quer mesmo limpar todo o histórico?")) {
      clearTemperatures();
      setTemperatures([]);
    }
  };

  const toggleAutoMode = () => setAutoMode((p) => !p);

  useEffect(() => {
    if (autoMode) {
      intervalRef.current = window.setInterval(() => {
        const randomTemp = Math.floor(Math.random() * 40) - 5;
        handleAdd(randomTemp);
      }, 2100) as unknown as number;
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [autoMode]);

  const chartData = {
    labels: temperatures.map((t) => new Date(t.date).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatures.map((t) => t.value),
        borderColor: "#1e40af",
        backgroundColor: "rgba(30,64,175,0.18)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { maxRotation: 0, minRotation: 0 } },
    },
  };

  const latestTemp = temperatures.at(-1)?.value ?? 0;

  return (
    <>
      <Navbar />
      <main className="home-main">
        <section className="home-container">
          <h1>Simulador de Temperaturas</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="Digite a temperatura"
            />
            <button type="submit">Adicionar</button>
          </form>

          <div className="button-group">
            <button onClick={toggleAutoMode} className={autoMode ? "active" : ""}>
              {autoMode ? "Parar Simulação" : "Iniciar Simulação"}
            </button>
            {temperatures.length > 0 && (
              <button onClick={handleClear} className="danger">
                Limpar histórico
              </button>
            )}
          </div>

          <div className="panels">
            <div className="panel">
              <h3>Temperatura Atual</h3>
              <ThermometerGauge value={latestTemp} min={-10} max={40} size={240} />
            </div>

            <div className="panel chart-panel">
              <h3>Histórico</h3>
              <div className="chart-wrapper">
                {temperatures.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <p>Nenhuma temperatura registrada ainda.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
