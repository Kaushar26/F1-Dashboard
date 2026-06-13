import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, LineChart, Line
} from "recharts";
import { useFetch } from "../../hooks/useFetch";
import {
  getDriverStandings, getConstructorStandings, getTeamColor,
} from "../../services/api";

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

// Stat block — like broadcast overlay
function StatBlock({ label, value, sub, accent }) {
  return (
    <div className={`glass border rounded-xl p-4 ${accent ? "border-f1red/40 glass-red" : "border-f1border"}`}>
      <div className="font-rajdhani text-f1muted text-xs tracking-widest uppercase mb-1">{label}</div>
      <div className={`font-orbitron font-black text-2xl ${accent ? "text-f1red" : "text-white"}`}>{value}</div>
      {sub && <div className="font-rajdhani text-f1muted text-xs mt-1">{sub}</div>}
    </div>
  );
}

// Telemetry-style progress bar
function TelemetryBar({ label, value, max, color }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="font-rajdhani text-f1muted text-xs tracking-widest uppercase">{label}</span>
        <span className="font-orbitron text-xs text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-f1dark rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { data: driverStandings } = useFetch(getDriverStandings);
  const { data: constructorStandings } = useFetch(getConstructorStandings);

  const leader = driverStandings?.[0];
  const leaderPts = parseFloat(leader?.points || 1);
  const totalWins = driverStandings?.reduce((s, d) => s + parseInt(d.wins), 0) || 0;
  const totalRaces = driverStandings?.[0] ? Math.max(...driverStandings.map(d => parseInt(d.wins))) : 0;

  // Top 10 drivers bar chart
  const driverBarData = driverStandings?.slice(0, 10).map((s) => ({
    name: s.Driver.code || s.Driver.familyName.slice(0, 3).toUpperCase(),
    Points: parseFloat(s.points),
    Wins: parseInt(s.wins),
  })) || [];

  // Points gap area chart
  const gapData = driverStandings?.slice(0, 10).map((s) => ({
    name: s.Driver.code || s.Driver.familyName.slice(0, 3).toUpperCase(),
    Points: parseFloat(s.points),
    Gap: parseFloat(leaderPts) - parseFloat(s.points),
  })) || [];

  // Constructor data
  const constructorBarData = constructorStandings?.map((s) => ({
    name: s.Constructor.name,
    Points: parseFloat(s.points),
    color: getTeamColor(s.Constructor.constructorId),
  })) || [];

  const maxConstructorPts = constructorBarData[0]?.Points || 1;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-f1red" />
            <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">
              Season Overview
            </span>
          </div>
          <h1 className="font-orbitron font-black text-white text-4xl md:text-5xl mb-3">
            RACE ANALYTICS
          </h1>
          <p className="font-rajdhani text-f1muted text-lg max-w-xl">
            Championship standings, constructor performance, and season-wide data visualizations.
          </p>
        </motion.div>

        {/* Broadcast-style top stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <StatBlock
            label="Championship Leader"
            value={leader?.Driver.code || leader?.Driver.familyName.slice(0, 3).toUpperCase() || "—"}
            sub={leader?.Constructors?.[0]?.name}
            accent
          />
          <StatBlock
            label="Leader Points"
            value={leader?.points || "—"}
            sub="Current Season"
          />
          <StatBlock
            label="Total Race Wins"
            value={totalWins}
            sub="Across all drivers"
          />
          <StatBlock
            label="Active Drivers"
            value={driverStandings?.length || "—"}
            sub="On the grid"
          />
        </motion.div>

        {/* Championship leader panel — broadcast style */}
        {leader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-red border border-f1red/20 rounded-2xl p-8 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-f1red to-transparent" />
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left — driver info */}
              <div>
                <div className="font-rajdhani text-f1muted text-sm tracking-widest uppercase mb-2">
                  Championship Leader
                </div>
                <div className="font-orbitron font-black text-white text-4xl mb-1">
                  {leader.Driver.givenName.toUpperCase()}
                </div>
                <div className="font-orbitron font-black text-f1red text-5xl mb-3">
                  {leader.Driver.familyName.toUpperCase()}
                </div>
                <div
                  className="font-rajdhani font-bold text-lg tracking-wider"
                  style={{ color: getTeamColor(leader.Constructors?.[0]?.constructorId) }}
                >
                  {leader.Constructors?.[0]?.name}
                </div>
              </div>

              {/* Right — telemetry stats */}
              <div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Points", value: leader.points },
                    { label: "Wins", value: leader.wins },
                    { label: "Position", value: `P${leader.position}` },
                  ].map((s) => (
                    <div key={s.label} className="glass border border-f1border rounded-xl p-3 text-center">
                      <div className="font-orbitron font-black text-f1red text-2xl">{s.value}</div>
                      <div className="font-rajdhani text-f1muted text-xs tracking-widest uppercase mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bars vs field */}
                <TelemetryBar
                  label="Points vs Field"
                  value={leader.points}
                  max={leaderPts}
                  color="#E10600"
                />
                <TelemetryBar
                  label="Wins vs Field"
                  value={parseInt(leader.wins)}
                  max={Math.max(...(driverStandings?.map(d => parseInt(d.wins)) || [1]))}
                  color="#E10600"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Driver points + gap charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-f1border rounded-2xl p-6"
          >
            <div className="font-orbitron text-white text-sm tracking-widest mb-6">
              TOP 10 — DRIVER POINTS
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={driverBarData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Points" fill="#E10600" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass border border-f1border rounded-2xl p-6"
          >
            <div className="font-orbitron text-white text-sm tracking-widest mb-6">
              POINTS GAP TO LEADER
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={gapData}>
                <defs>
                  <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E10600" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E10600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Gap" stroke="#E10600" fill="url(#gapGrad)" strokeWidth={2} dot={{ r: 3, fill: "#E10600" }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Constructor telemetry panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-f1border rounded-2xl p-8 mb-6"
        >
          <div className="font-orbitron text-white text-sm tracking-widest mb-8">
            CONSTRUCTOR PERFORMANCE
          </div>
          <div className="space-y-4">
            {constructorBarData.map((team, i) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="font-orbitron text-f1muted text-xs w-6 text-right">{i + 1}</div>
                <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                <div className="font-rajdhani text-white text-sm w-28 shrink-0">{team.name}</div>
                <div className="flex-1 h-2 bg-f1dark rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(team.Points / maxConstructorPts) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                </div>
                <div className="font-orbitron text-white text-sm w-16 text-right shrink-0">
                  {team.Points} <span className="text-f1muted text-xs">PTS</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wins distribution */}
        {driverBarData.filter(d => d.Wins > 0).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-f1border rounded-2xl p-6"
          >
            <div className="font-orbitron text-white text-sm tracking-widest mb-6">
              RACE WINS DISTRIBUTION
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={driverBarData.filter(d => d.Wins > 0)} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Wins" fill="#FFD700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

      </div>
    </div>
  );
}