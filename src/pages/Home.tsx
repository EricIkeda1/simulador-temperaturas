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
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Home: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>(getTemperatures());
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleAdd = (temp?: number) => {
    const temperatureValue = temp ?? value;
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
    clearTemperatures();
    setTemperatures([]);
  };

  const toggleAutoMode = () => {
    setAutoMode((prev) => !prev);
  };

  useEffect(() => {
    if (autoMode) {
      intervalRef.current = window.setInterval(() => {
        const randomTemp = Math.floor(Math.random() * 40) - 5; 
        handleAdd(randomTemp);
      }, 2000);
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
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="home-container">
      <h1>Simulador de Temperaturas</h1>

      <form
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
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="buttons">
        <button onClick={toggleAutoMode} className="auto-btn">
          {autoMode ? "Parar Simulação" : "Iniciar Simulação"}
        </button>
        {temperatures.length > 0 && (
          <button onClick={handleClear} className="clear-btn">
            Limpar histórico
          </button>
        )}
      </div>

      <div className="chart-container">
        {temperatures.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>Nenhuma temperatura registrada ainda.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
