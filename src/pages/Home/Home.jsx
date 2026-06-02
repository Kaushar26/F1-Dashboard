import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { getDriverStandings, getConstructorStandings, getLastRaceResults, getTeamColor, getFlag } from "../../services/api";
import { DriverCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton";


// Top 3 mini driver chip
function DriverChip({ standing, rank }) {
  const driver = standing.Driver;
  const constructor = standing.Constructors?.[0];
  const teamColor = getTeamColor(constructor?.constructorId);
  const colors = ["text-yellow-400", "text-gray-300", "text-amber-600"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + rank * 0.1 }}
      className="glass border border-f1border rounded-xl p-4 flex items-center gap-4 hover:border-f1red/30 transition-colors duration-300"
    >
      <div className={`font-orbitron font-black text-2xl ${colors[rank]}`}>
        {rank + 1}
      </div>
      <div className="flex-1">
        <div className="font-orbitron font-bold text-white text-sm">
          {driver.familyName.toUpperCase()}
        </div>
        <div className="font-rajdhani text-xs tracking-wider" style={{ color: teamColor }}>
          {constructor?.name}
        </div>
      </div>
      <div className="text-right">
        <div className="font-orbitron font-bold text-white text-sm">{standing.points}</div>
        <div className="font-rajdhani text-f1muted text-[10px] tracking-widest">PTS</div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { data: driverStandings, loading: driversLoading } = useFetch(getDriverStandings);
  const { data: constructorStandings } = useFetch(getConstructorStandings);
  const { data: lastRace } = useFetch(getLastRaceResults);

  const top3 = driverStandings?.slice(0, 3) || [];
  

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background layers */}
        
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-f1dark/40 to-f1dark" />

        {/* Red corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-f1red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-f1red/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — headline */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-12 bg-f1red" />
                <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">
                  Race Analytics Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="font-orbitron font-black leading-none mb-4"
              >
                <span className="block text-5xl md:text-7xl text-white">F1</span>
                <span className="block text-3xl md:text-5xl text-f1red text-glow">TELEMETRY</span>
                <span className="block text-3xl md:text-5xl text-white/70">DASHBOARD</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-rajdhani text-f1muted text-lg leading-relaxed max-w-lg mb-8"
              >
                Real-time Formula 1 analytics. Driver standings, constructor rankings,
                race calendar, and interactive driver comparisons — all in one cinematic dashboard.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/drivers"
                  className="font-orbitron text-xs tracking-widest px-6 py-3 bg-f1red hover:bg-red-700 text-white rounded transition-colors duration-200 border border-f1red"
                >
                  VIEW STANDINGS
                </Link>
                <Link
                  to="/compare"
                  className="font-orbitron text-xs tracking-widest px-6 py-3 glass border border-f1border hover:border-f1red/40 text-white rounded transition-all duration-200"
                >
                  COMPARE DRIVERS
                </Link>
              </motion.div>
            </div>

            {/* Right — live stats panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="glass-red rounded-2xl p-6 border border-f1red/20">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 bg-f1red rounded-full" />
                  <span className="font-orbitron text-f1red text-xs tracking-widest">
                    CHAMPIONSHIP STANDINGS
                  </span>
                </div>

                {driversLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <DriverCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {top3.map((s, i) => (
                      <DriverChip key={s.Driver.driverId} standing={s} rank={i} />
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-f1red/10">
                  <Link
                    to="/drivers"
                    className="font-orbitron text-xs text-f1red tracking-widest hover:underline flex items-center gap-2"
                  >
                    VIEW ALL DRIVERS →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LAST RACE RESULT */}
      {lastRace && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-f1border" />
              <span className="font-orbitron text-f1muted text-xs tracking-[0.3em] uppercase">
                Last Race
              </span>
              <div className="h-px flex-1 bg-f1border" />
            </div>

            <div className="glass border border-f1border rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="font-rajdhani text-f1muted text-sm tracking-widest uppercase mb-1">
                    Round {lastRace.round} · {lastRace.date}
                  </div>
                  <div className="font-orbitron font-bold text-white text-2xl md:text-3xl">
                    {lastRace.raceName?.toUpperCase()}
                  </div>
                  <div className="font-rajdhani text-f1muted mt-1">
                    {lastRace.Circuit?.circuitName}
                  </div>
                </div>
              </div>

              {/* Top 3 podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lastRace.Results?.slice(0, 3).map((result, i) => {
                  const podiumColors = ["text-yellow-400 border-yellow-400/30", "text-gray-300 border-gray-500/30", "text-amber-600 border-amber-600/30"];
                  const labels = ["🥇 WINNER", "🥈 2ND PLACE", "🥉 3RD PLACE"];
                  return (
                    <div key={i} className={`glass border rounded-xl p-4 ${podiumColors[i]}`}>
                      <div className="font-rajdhani text-xs tracking-widest mb-2 opacity-70">{labels[i]}</div>
                      <div className="font-orbitron font-bold text-base">
                        {result.Driver.familyName.toUpperCase()}
                      </div>
                      <div className="font-rajdhani text-f1muted text-sm mt-1">
                        {result.Constructor.name}
                      </div>
                      <div className="font-orbitron text-sm mt-2">
                        {result.Time?.time || result.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Constructor preview */}
      {constructorStandings && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-orbitron font-bold text-white text-xl">CONSTRUCTOR STANDINGS</h2>
                <p className="font-rajdhani text-f1muted mt-1">Current season team rankings</p>
              </div>
              <Link
                to="/teams"
                className="font-orbitron text-xs text-f1red tracking-widest hover:underline"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="space-y-3">
              {constructorStandings.slice(0, 5).map((s, i) => {
                const teamColor = getTeamColor(s.Constructor.constructorId);
                const maxPts = parseFloat(constructorStandings[0]?.points || 1);
                const barW = (parseFloat(s.points) / maxPts) * 100;

                return (
                  <motion.div
                    key={s.Constructor.constructorId}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="glass border border-f1border rounded-xl px-5 py-4 flex items-center gap-5 hover:border-white/10 transition-colors duration-300"
                  >
                    <div className="font-orbitron font-black text-f1muted/40 text-xl w-8 text-center">
                      {s.position}
                    </div>
                    <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: teamColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-orbitron font-bold text-white text-sm">{s.Constructor.name.toUpperCase()}</div>
                      <div className="mt-1 h-1 bg-f1dark rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${barW}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 + 0.3, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: teamColor }}
                        />
                      </div>
                    </div>
                    <div className="font-orbitron font-bold text-white text-sm shrink-0">
                      {s.points} <span className="text-f1muted font-normal text-xs">PTS</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
