import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, type ChartOptions } from "chart.js";
import type { TemperatureRecord } from "../ts/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface TemperaturaChartProps {
  temperatures: TemperatureRecord[];
}

const TemperaturaChart: React.FC<TemperaturaChartProps> = ({ temperatures }) => {
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
    plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
    scales: { y: { beginAtZero: true }, x: { ticks: { maxRotation: 0, minRotation: 0 } } },
  };

  return (
    <div className="chart-wrapper">
      {temperatures.length > 0 ? <Line data={chartData} options={chartOptions} /> : <p>Nenhuma temperatura registrada ainda.</p>}
    </div>
  );
};

export default TemperaturaChart;
