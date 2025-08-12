import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { TemperatureRecord } from "../ts/types";
import { getTemperatures, saveTemperature, clearTemperatures } from "../ts/storage";
import "../styles/home.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Home: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>(getTemperatures());
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleAdd = (temp?: number) => {
    const temperatureValue = temp ?? value;
    if (isNaN(temperatureValue)) return;
    const newRecord: TemperatureRecord = {
      id: uuidv4(),
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

  const toggleAutoMode = () => {
    setAutoMode((prev) => !prev);
  };

  useEffect(() => {
    if (autoMode) {
      intervalRef.current = window.setInterval(() => {
        const randomTemp = Math.floor(Math.random() * 40) - 5;
        handleAdd(randomTemp);
      }, 2100);
    } else {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [autoMode]);

  const chartData = {
    labels: temperatures.map((t) => new Date(t.date).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatures.map((t) => t.value),
        borderColor: "#1e40af",
        backgroundColor: "rgba(30, 64, 175, 0.25)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  return (
    <>
      <main className="container">
        <h1>Simulador de Temperaturas</h1>

        <form
          id="add"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          className="form"
        >
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="Digite a temperatura"
            aria-label="Temperatura em graus Celsius"
          />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>

        <div className="button-group">
          <button onClick={toggleAutoMode} className={`btn-toggle ${autoMode ? "active" : ""}`}>
            {autoMode ? "Parar Simulação" : "Iniciar Simulação"}
          </button>
          {temperatures.length > 0 && (
            <button onClick={handleClear} className="btn-clear">
              Limpar histórico
            </button>
          )}
        </div>

        <section id="graph" className="chart-area">
          {temperatures.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p className="empty-msg">Nenhuma temperatura registrada ainda.</p>
          )}
        </section>
      </main>

    </>
  );
};

export default Home;
