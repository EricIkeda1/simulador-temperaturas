import type { TemperatureRecord } from "./types";

const STORAGE_KEY = "temperature_history";

export function saveTemperature(record: TemperatureRecord) {
  const data = getTemperatures();
  data.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTemperatures(): TemperatureRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearTemperatures() {
  localStorage.removeItem(STORAGE_KEY);
}
