import React, { useState, useEffect } from "react";
import type { TemperatureRecord } from "../ts/types";
import { getTemperatures } from "../ts/storage";
import Navbar from "../components/Navbar";
import "../styles/download.css";

const Download: React.FC = () => {
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>([]);

  useEffect(() => {
    setTemperatures(getTemperatures());
  }, []);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (temperatures.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const header = ["ID", "Temperatura (°C)", "Data"];
    const rows = temperatures.map(({ id, value, date }) => [
      id,
      value.toString(),
      new Date(date).toLocaleString(),
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile(csvContent, "temperaturas.csv", "text/csv;charset=utf-8;");
  };

  const exportJSON = () => {
    if (temperatures.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const jsonContent = JSON.stringify(temperatures, null, 2);
    downloadFile(jsonContent, "temperaturas.json", "application/json;charset=utf-8;");
  };

  const exportTXT = () => {
    if (temperatures.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const lines = temperatures.map(
      (t) =>
        `ID: ${t.id} | Temperatura: ${t.value}°C | Data: ${new Date(t.date).toLocaleString()}`
    );
    const txtContent = lines.join("\n");
    downloadFile(txtContent, "temperaturas.txt", "text/plain;charset=utf-8;");
  };

  return (
    <>
      <Navbar />
      <main className="download-main">
        <h1>Exportar Dados de Temperatura</h1>
        {temperatures.length === 0 ? (
          <p className="no-data">Não há dados disponíveis para exportação.</p>
        ) : (
          <div className="button-group">
            <button onClick={exportCSV} className="btn btn-csv">Exportar CSV</button>
            <button onClick={exportJSON} className="btn btn-json">Exportar JSON</button>
            <button onClick={exportTXT} className="btn btn-txt">Exportar TXT</button>
          </div>
        )}
      </main>
    </>
  );
};

export default Download;
