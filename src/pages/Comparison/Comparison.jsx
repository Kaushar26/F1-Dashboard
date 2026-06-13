import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from "recharts";
import {
  getDriverStandings, getDriverSeasonResults, getTeamColor, getFlag,
} from "../../services/api";
import { useFetch } from "../../hooks/useFetch";

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-f1border rounded-lg px-3 py-2">
      <div className="font-rajdhani text-f1muted text-xs mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="font-orbitron text-xs" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

// Driver selector dropdown
function DriverSelector({ standings, selected, onSelect, label, accentColor }) {
  const [open, setOpen] = useState(false);
  const driver = standings?.find((s) => s.Driver.driverId === selected);

  return (
    <div className="relative">
      <div className="font-orbitron text-xs text-f1muted tracking-widest mb-2 uppercase">{label}</div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full glass border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-f1red/40 transition-all duration-200"
        style={{ borderColor: driver ? `${accentColor}40` : undefined }}
      >
        {driver ? (
          <>
            <span className="text-lg">{getFlag(driver.Driver.nationality)}</span>
            <div className="flex-1 text-left">
              <div className="font-orbitron font-bold text-white text-sm">
                {driver.Driver.familyName.toUpperCase()}
              </div>
              <div className="font-rajdhani text-f1muted text-xs">
                {driver.Constructors?.[0]?.name}
              </div>
            </div>
            <div className="font-orbitron text-sm" style={{ color: accentColor }}>
              {driver.points} PTS
            </div>
          </>
        ) : (
          <span className="font-rajdhani text-f1muted text-sm">Select a driver...</span>
        )}
        <span className="text-f1muted">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 glass border border-f1border rounded-xl overflow-hidden z-20 max-h-64 overflow-y-auto"
          >
            {standings?.map((s) => (
              <button
                key={s.Driver.driverId}
                onClick={() => { onSelect(s.Driver.driverId); setOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-f1border/30 last:border-0 ${
                  s.Driver.driverId === selected ? "bg-f1red/10" : ""
                }`}
              >
                import { getDriverStandings, getDriverSeasonResults, getTeamColor, getFlag } from "../../services/api";
                <div className="flex-1">
                  <div className="font-orbitron text-white text-xs">
                    {s.Driver.givenName} {s.Driver.familyName}
                  </div>
                  <div className="font-rajdhani text-f1muted text-xs">
                    {s.Constructors?.[0]?.name}
                  </div>
                </div>
                <div className="font-orbitron text-f1muted text-xs">{s.points}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Stat comparison bar
function StatBar({ label, val1, val2, color1, color2, max }) {
  const w1 = max ? (val1 / max) * 100 : 0;
  const w2 = max ? (val2 / max) * 100 : 0;

  return (
    <div className="mb-4 pb-4 border-b border-f1border/30">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-orbitron text-xs" style={{ color: color1 }}>{val1}</span>
        <span className="font-rajdhani text-f1muted text-xs tracking-widest uppercase">{label}</span>
        <span className="font-orbitron text-xs" style={{ color: color2 }}>{val2}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end rounded-l-full overflow-hidden bg-f1dark">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${w1}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-l-full"
            style={{ backgroundColor: color1 }}
          />
        </div>
        <div className="w-px bg-f1border" />
        <div className="flex-1 rounded-r-full overflow-hidden bg-f1dark">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${w2}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-r-full"
            style={{ backgroundColor: color2 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Compare() {
  const { data: standings } = useFetch(getDriverStandings);
  const [driver1Id, setDriver1Id] = useState("max_verstappen");
  const [driver2Id, setDriver2Id] = useState("hamilton");

  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [loading, setLoading] = useState(false);

  const d1Standing = standings?.find((s) => s.Driver.driverId === driver1Id);
  const d2Standing = standings?.find((s) => s.Driver.driverId === driver2Id);

  const color1 = d1Standing ? getTeamColor(d1Standing.Constructors?.[0]?.constructorId) : "#E10600";
  const color2 = d2Standing ? getTeamColor(d2Standing.Constructors?.[0]?.constructorId) : "#3671C6";

  useEffect(() => {
    if (!driver1Id || !driver2Id) return;
    setLoading(true);
    Promise.all([
      getDriverSeasonResults(driver1Id),
      getDriverSeasonResults(driver2Id),
    ]).then(([r1, r2]) => {
      setResults1(r1);
      setResults2(r2);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [driver1Id, driver2Id]);

  // Compute stats
  const getStats = (standing, results) => {
    const pts = parseFloat(standing?.points || 0);
    const wins = parseInt(standing?.wins || 0);
    const podiums = results.filter((r) =>
      parseInt(r.Results?.[0]?.position) <= 3
    ).length;
    const dnfs = results.filter((r) =>
      r.Results?.[0]?.status !== "Finished" && !r.Results?.[0]?.status?.includes("+")
    ).length;
    const avgPos = results.length
      ? (results.reduce((s, r) => s + parseInt(r.Results?.[0]?.position || 20), 0) / results.length).toFixed(1)
      : 0;

    return { pts, wins, podiums, dnfs, avgPos: parseFloat(avgPos), races: results.length };
  };

  const stats1 = getStats(d1Standing, results1);
  const stats2 = getStats(d2Standing, results2);

  // Radar data
  const radarData = [
    { subject: "Points", A: stats1.pts, B: stats2.pts },
    { subject: "Wins", A: stats1.wins * 50, B: stats2.wins * 50 },
    { subject: "Podiums", A: stats1.podiums * 30, B: stats2.podiums * 30 },
    { subject: "Races", A: stats1.races * 10, B: stats2.races * 10 },
    { subject: "Finish Pos", A: Math.max(0, 200 - stats1.avgPos * 10), B: Math.max(0, 200 - stats2.avgPos * 10) },
  ];

  // Race-by-race finishing pos line chart
  const maxRaces = Math.max(results1.length, results2.length);
  const lineData = [...Array(maxRaces)].map((_, i) => ({
    race: i + 1,
    [d1Standing?.Driver.familyName || "D1"]: parseInt(results1[i]?.Results?.[0]?.position || 20),
    [d2Standing?.Driver.familyName || "D2"]: parseInt(results2[i]?.Results?.[0]?.position || 20),
  }));

  const barData = [
    { name: "Points", [d1Standing?.Driver.familyName || "D1"]: stats1.pts, [d2Standing?.Driver.familyName || "D2"]: stats2.pts },
    { name: "Wins", [d1Standing?.Driver.familyName || "D1"]: stats1.wins, [d2Standing?.Driver.familyName || "D2"]: stats2.wins },
    { name: "Podiums", [d1Standing?.Driver.familyName || "D1"]: stats1.podiums, [d2Standing?.Driver.familyName || "D2"]: stats2.podiums },
    { name: "DNFs", [d1Standing?.Driver.familyName || "D1"]: stats1.dnfs, [d2Standing?.Driver.familyName || "D2"]: stats2.dnfs },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-f1red" />
            <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">Head to Head</span>
          </div>
          <h1 className="font-orbitron font-black text-white text-4xl md:text-5xl mb-3">
            DRIVER COMPARISON
          </h1>
          <p className="font-rajdhani text-f1muted text-lg max-w-xl">
            Select two drivers to compare their season statistics, performance trends, and analytics.
          </p>
        </motion.div>

        {/* Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          <DriverSelector
            standings={standings}
            selected={driver1Id}
            onSelect={setDriver1Id}
            label="Driver 1"
            accentColor={color1}
          />
          <DriverSelector
            standings={standings}
            selected={driver2Id}
            onSelect={setDriver2Id}
            label="Driver 2"
            accentColor={color2}
          />
        </motion.div>

        {loading && (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-f1red border-t-transparent rounded-full mx-auto mb-3"
            />
            <div className="font-orbitron text-f1muted text-xs tracking-widest">LOADING TELEMETRY...</div>
          </div>
        )}

        {!loading && d1Standing && d2Standing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Head-to-head stat bars */}
            <div className="glass border border-f1border rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="font-orbitron font-bold text-sm" style={{ color: color1 }}>
                  {d1Standing.Driver.familyName.toUpperCase()}
                </div>
                <div className="font-orbitron text-f1muted text-xs tracking-widest">VS</div>
                <div className="font-orbitron font-bold text-sm" style={{ color: color2 }}>
                  {d2Standing.Driver.familyName.toUpperCase()}
                </div>
              </div>

              <StatBar label="POINTS" val1={stats1.pts} val2={stats2.pts} color1={color1} color2={color2} max={Math.max(stats1.pts, stats2.pts) || 1} />
              <StatBar label="WINS" val1={stats1.wins} val2={stats2.wins} color1={color1} color2={color2} max={Math.max(stats1.wins, stats2.wins) || 1} />
              <StatBar label="PODIUMS" val1={stats1.podiums} val2={stats2.podiums} color1={color1} color2={color2} max={Math.max(stats1.podiums, stats2.podiums) || 1} />
              <StatBar label="RACES" val1={stats1.races} val2={stats2.races} color1={color1} color2={color2} max={Math.max(stats1.races, stats2.races) || 1} />
              <StatBar label="AVG FINISH" val1={stats1.avgPos} val2={stats2.avgPos} color1={color1} color2={color2} max={Math.max(stats1.avgPos, stats2.avgPos) || 1} />
            </div>

            {/* Charts grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Radar */}
              <div className="glass border border-f1border rounded-2xl p-6">
                <div className="font-orbitron text-white text-sm tracking-widest mb-6">
                  PERFORMANCE RADAR
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2a2a2a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} />
                    <Radar name={d1Standing.Driver.familyName} dataKey="A" stroke={color1} fill={color1} fillOpacity={0.15} />
                    <Radar name={d2Standing.Driver.familyName} dataKey="B" stroke={color2} fill={color2} fillOpacity={0.15} />
                    <Legend wrapperStyle={{ fontFamily: "Orbitron", fontSize: 10 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Bar */}
              <div className="glass border border-f1border rounded-2xl p-6">
                <div className="font-orbitron text-white text-sm tracking-widest mb-6">
                  STAT COMPARISON
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontFamily: "Orbitron", fontSize: 10 }} />
                    <Bar dataKey={d1Standing.Driver.familyName} fill={color1} radius={[4, 4, 0, 0]} />
                    <Bar dataKey={d2Standing.Driver.familyName} fill={color2} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Race-by-race line chart */}
            {lineData.length > 0 && (
              <div className="glass border border-f1border rounded-2xl p-6">
                <div className="font-orbitron text-white text-sm tracking-widest mb-6">
                  FINISHING POSITION — RACE BY RACE
                  <span className="font-rajdhani text-f1muted text-xs ml-3 tracking-normal">
                    (lower = better)
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="race" label={{ value: "Round", position: "insideBottom", fill: "#888", fontSize: 10 }} tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis reversed domain={[1, 20]} tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontFamily: "Orbitron", fontSize: 10 }} />
                    <Line type="monotone" dataKey={d1Standing.Driver.familyName} stroke={color1} strokeWidth={2} dot={{ r: 3, fill: color1 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey={d2Standing.Driver.familyName} stroke={color2} strokeWidth={2} dot={{ r: 3, fill: color2 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
