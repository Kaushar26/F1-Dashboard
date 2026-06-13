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

// Driver headshots from OpenF1
export async function getDriverHeadshots() {
  const data = await fetchWithCache(
    "https://api.openf1.org/v1/drivers?session_key=latest"
  );
  // Map by last name for easy lookup
  const map = {};
  data.forEach((d) => {
    if (d.headshot_url) {
      map[d.last_name.toUpperCase()] = d.headshot_url;
    }
  });
  return map;
}

export const DRIVER_IMAGES = {
  "antonelli": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2025_Bahrain_GP_-_Andrea_Kimi_Antonelli.jpg/440px-2025_Bahrain_GP_-_Andrea_Kimi_Antonelli.jpg",
  "hamilton": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
  "russell": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
  "leclerc": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
  "piastri": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
  "norris": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
  "max_verstappen": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
  "hadjar": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png",
  "alonso": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
  "stroll": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png",
  "gasly": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png",
  "doohan": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png",
  "albon": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png",
  "sainz": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
  "hulkenberg": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png",
  "bearman": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png",
  "tsunoda": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png",
  "lawson": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png",
  "ocon": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2024_Bahrain_GP_-_Esteban_Ocon.jpg/440px-2024_Bahrain_GP_-_Esteban_Ocon.jpg",
  "colapinto": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png",
  "bortoleto": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/2025_Bahrain_GP_-_Gabriel_Bortoleto.jpg/440px-2025_Bahrain_GP_-_Gabriel_Bortoleto.jpg",
  "lindblad": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Oliver_Lindblad_2024.jpg/440px-Oliver_Lindblad_2024.jpg",
  "bottas": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png",
  "perez": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1102/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png",
};
export function getDriverImage(driverId) {
  return DRIVER_IMAGES[driverId.toLowerCase()] || null;
}