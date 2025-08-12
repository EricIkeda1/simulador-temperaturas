import React, { useEffect, useRef, useState } from "react";
import type { TemperatureRecord } from "../ts/types";
import { getTemperatures, saveTemperature, clearTemperatures } from "../ts/storage";
import Navbar from "../components/Navbar";
import ThermometerGauge from "../graficos/ThermometerGauge";
import TemperaturaChart from "../graficos/TemperaturaChart";
import "../styles/home.css";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const Home: React.FC = () => {
  const [value, setValue] = useState<string>("");

  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>(getTemperatures);
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleAdd = (temp?: number) => {
    const temperatureValue = temp ?? Number(value);
    if (Number.isNaN(temperatureValue)) return;

    saveTemperature({
      id: genId(),
      value: temperatureValue,
      date: new Date().toISOString(),
    });

    setValue(""); 
    setTemperatures(getTemperatures());
  };

  useEffect(() => {
    if (autoMode) {
      intervalRef.current = window.setInterval(
        () => handleAdd(Math.floor(Math.random() * 40) - 5),
        2100
      ) as unknown as number;
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoMode]);

  const latestTemp = temperatures.at(-1)?.value ?? 0;

  return (
    <>
      <Navbar />
      <main className="home-main">
        <section className="home-container">
          <h1>Simulador de Temperaturas</h1>

          <div className="button-group">
            <button
              onClick={() => setAutoMode((p) => !p)}
              className={autoMode ? "active" : ""}
            >
              {autoMode ? "Parar Simulação" : "Iniciar Simulação"}
            </button>
            {temperatures.length > 0 && (
              <button onClick={() => {
                if (window.confirm("Quer mesmo limpar todo o histórico?")) {
                  clearTemperatures();
                  setTemperatures([]);
                }
              }} className="danger">
                Limpar histórico
              </button>
            )}
          </div>

          <div className="panels">
            <div className="panel gauge-panel">
              <h3>Temperatura Atual</h3>
              <ThermometerGauge value={latestTemp} min={-10} max={40} size={280} />
            </div>
            <div className="panel chart-panel">
              <h3>Histórico</h3>
              <TemperaturaChart temperatures={temperatures} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
