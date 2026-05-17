import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Legend, AreaChart, Area,
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

export default function Analytics() {
  const { data: driverStandings } = useFetch(getDriverStandings);
  const { data: constructorStandings } = useFetch(getConstructorStandings);

  // Driver pts top 10 bar chart data
  const driverBarData = driverStandings?.slice(0, 10).map((s) => ({
    name: s.Driver.code || s.Driver.familyName.slice(0, 3).toUpperCase(),
    Points: parseFloat(s.points),
    Wins: parseInt(s.wins),
  })) || [];

  // Constructor data
  const constructorBarData = constructorStandings?.map((s) => ({
    name: s.Constructor.name.split(" ").pop(), // Last word (e.g. "Bull" → "Red Bull")
    Points: parseFloat(s.points),
    fill: getTeamColor(s.Constructor.constructorId),
  })) || [];

  // Points gap from leader (area chart)
  const leaderPts = driverStandings?.[0]?.points || 1;
  const gapData = driverStandings?.slice(0, 10).map((s) => ({
    name: s.Driver.code || s.Driver.familyName.slice(0, 3).toUpperCase(),
    Points: parseFloat(s.points),
    Gap: parseFloat(leaderPts) - parseFloat(s.points),
  })) || [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-f1red" />
            <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">
              Telemetry Analytics
            </span>
          </div>
          <h1 className="font-orbitron font-black text-white text-4xl md:text-5xl mb-3">
            RACE ANALYTICS
          </h1>
          <p className="font-rajdhani text-f1muted text-lg max-w-xl">
            Championship insights, performance metrics, and season-wide data visualizations.
          </p>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "DRIVERS", value: driverStandings?.length || "—" },
            { label: "CONSTRUCTORS", value: constructorStandings?.length || "—" },
            { label: "LEADER POINTS", value: driverStandings?.[0]?.points || "—" },
            { label: "SEASON WINS", value: driverStandings?.reduce((s, d) => s + parseInt(d.wins), 0) || "—" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass border border-f1border rounded-xl p-5 text-center hover:border-f1red/30 transition-colors duration-300"
            >
              <div className="font-orbitron font-black text-f1red text-3xl mb-1">{stat.value}</div>
              <div className="font-rajdhani text-f1muted text-xs tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top 10 Driver Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-f1border rounded-2xl p-8 mb-6"
        >
          <div className="font-orbitron text-white text-sm tracking-widest mb-8">
            TOP 10 DRIVER POINTS
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={driverBarData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Points" fill="#E10600" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Constructor Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-f1border rounded-2xl p-8"
          >
            <div className="font-orbitron text-white text-sm tracking-widest mb-8">
              CONSTRUCTOR POINTS
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={constructorBarData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#ccc", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                {constructorBarData.map((entry, i) => (
                  <Bar key={i} dataKey="Points" fill={entry.fill} radius={[0, 4, 4, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Points Gap from Leader */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass border border-f1border rounded-2xl p-8"
          >
            <div className="font-orbitron text-white text-sm tracking-widest mb-8">
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

        {/* Driver wins comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-f1border rounded-2xl p-8"
        >
          <div className="font-orbitron text-white text-sm tracking-widest mb-8">
            DRIVER WINS — SEASON
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={driverBarData.filter((d) => d.Wins > 0)} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10, fontFamily: "Rajdhani" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Wins" fill="#FFD700" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
