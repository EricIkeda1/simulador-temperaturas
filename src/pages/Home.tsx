import React, { useEffect, useRef, useState } from "react";
import type { TemperatureRecord } from "../ts/types";
import { getTemperatures, saveTemperature, clearTemperatures } from "../ts/storage";
import Navbar from "../components/Navbar";
import ThermometerGauge from "../graficos/ThermometerGauge";
import TemperaturaChart from "../graficos/TemperaturaChart";
import "../styles/home.css";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const AUTO_MODE_STORAGE_KEY = "autoMode";

const Home: React.FC = () => {
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>([]);
  const [autoMode, setAutoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTO_MODE_STORAGE_KEY);
    return saved === "true";
  });
  const intervalRef = useRef<number | null>(null);
  const lastTempRef = useRef<number>(20);

  const gerarTemperaturaSuave = (ultimaTemp: number): number => {
    const delta = Math.floor(Math.random() * 3) - 1;
    let novaTemp = ultimaTemp + delta;
    if (novaTemp < -5) novaTemp = -5;
    if (novaTemp > 35) novaTemp = 35;
    return novaTemp;
  };

  const handleAdd = (temp: number) => {
    if (Number.isNaN(temp)) return;
    const newRecord: TemperatureRecord = {
      id: genId(),
      value: temp,
      date: new Date().toISOString(),
    };
    saveTemperature(newRecord);
    setTemperatures((oldTemps) => [...oldTemps, newRecord]);
    lastTempRef.current = temp;
  };

  useEffect(() => {
    const dadosSalvos = getTemperatures();
    if (dadosSalvos.length === 0) {
      const tempInicial = Math.floor(Math.random() * 41) - 5;
      handleAdd(tempInicial);
    } else {
      setTemperatures(dadosSalvos);
      lastTempRef.current = dadosSalvos.at(-1)?.value ?? 20;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(AUTO_MODE_STORAGE_KEY, autoMode.toString());

    if (autoMode) {
      const primeiraTemp = gerarTemperaturaSuave(lastTempRef.current);
      handleAdd(primeiraTemp);

      intervalRef.current = window.setInterval(() => {
        const novaTemp = gerarTemperaturaSuave(lastTempRef.current);
        handleAdd(novaTemp);
      }, 3000);
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
              <button
                onClick={() => {
                  if (window.confirm("Quer mesmo limpar todo o histórico?")) {
                    clearTemperatures();
                    setTemperatures([]);
                  }
                }}
                className="danger"
              >
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
