// F1 Data Service — uses Ergast API (stable, no auth required)
const ERGAST_BASE = "https://api.jolpi.ca/ergast/f1";
const cache = new Map();

async function fetchWithCache(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

// Driver Standings — current season
export async function getDriverStandings(season = "current") {
  const data = await fetchWithCache(
    `${ERGAST_BASE}/${season}/driverStandings.json`
  );
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
}

// Constructor Standings — current season
export async function getConstructorStandings(season = "current") {
  const data = await fetchWithCache(
    `${ERGAST_BASE}/${season}/constructorStandings.json`
  );
  return (
    data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []
  );
}

// Race Schedule
export async function getRaceSchedule(season = "current") {
  const data = await fetchWithCache(`${ERGAST_BASE}/${season}.json`);
  return data.MRData.RaceTable.Races || [];
}

// Recent Race Results
export async function getLastRaceResults() {
  const data = await fetchWithCache(`${ERGAST_BASE}/current/last/results.json`);
  return data.MRData.RaceTable.Races[0] || null;
}

// Driver season results (for comparison)
export async function getDriverSeasonResults(driverId, season = "current") {
  const data = await fetchWithCache(
    `${ERGAST_BASE}/${season}/drivers/${driverId}/results.json?limit=100`
  );
  return data.MRData.RaceTable.Races || [];
}

// All drivers list
export async function getAllDrivers(season = "current") {
  const data = await fetchWithCache(
    `${ERGAST_BASE}/${season}/drivers.json?limit=100`
  );
  return data.MRData.DriverTable.Drivers || [];
}

// Constructor team colors mapping
export const TEAM_COLORS = {
  red_bull: "#3671C6",
  mercedes: "#27F4D2",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  williams: "#64C4FF",
  haas: "#B6BABD",
  sauber: "#52E252",
  rb: "#6692FF",
  // Legacy
  alphatauri: "#5E8FAA",
  alfa: "#900000",
  renault: "#FFF500",
  racing_point: "#F596C8",
  force_india: "#F596C8",
};

export function getTeamColor(constructorId) {
  return TEAM_COLORS[constructorId] || "#E10600";
}

// Country flag emoji helper
export function getFlag(nationality) {
  const flags = {
    British: "🇬🇧", Dutch: "🇳🇱", Monegasque: "🇲🇨", Spanish: "🇪🇸",
    Mexican: "🇲🇽", Australian: "🇦🇺", Finnish: "🇫🇮", French: "🇫🇷",
    German: "🇩🇪", Canadian: "🇨🇦", Thai: "🇹🇭", Japanese: "🇯🇵",
    Chinese: "🇨🇳", American: "🇺🇸", Danish: "🇩🇰", Brazilian: "🇧🇷",
    Italian: "🇮🇹", Argentine: "🇦🇷", Austrian: "🇦🇹", Belgian: "🇧🇪",
    "New Zealander": "🇳🇿", Polish: "🇵🇱", Russian: "🇷🇺", Swiss: "🇨🇭",
  };
  return flags[nationality] || "🏁";
}
