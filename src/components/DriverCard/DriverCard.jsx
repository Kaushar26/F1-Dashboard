import { motion } from "framer-motion";
import { getFlag, getTeamColor } from "../../services/api";

const POSITION_COLORS = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

export default function DriverCard({ standing, index }) {
  const driver = standing.Driver;
  const constructor = standing.Constructors?.[0];
  const teamColor = getTeamColor(constructor?.constructorId);
  const pos = parseInt(standing.position);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass border border-f1border hover:border-f1red/40 rounded-xl p-5 cursor-default group relative overflow-hidden transition-all duration-300"
      style={{ "--team-color": teamColor }}
    >
      {/* Team color top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: teamColor }}
      />

      {/* Position badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`font-orbitron font-black text-3xl ${POSITION_COLORS[pos] || "text-f1muted"}`}>
          {pos <= 9 ? `0${pos}` : pos}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xl">{getFlag(driver.nationality)}</span>
          <span className="font-rajdhani text-xs text-f1muted tracking-wider">
            {driver.nationality}
          </span>
        </div>
      </div>

      {/* Driver name */}
      <div className="mb-1">
        <div className="font-rajdhani text-f1muted text-sm tracking-widest uppercase">
          {driver.givenName}
        </div>
        <div className="font-orbitron font-bold text-lg text-white leading-tight">
          {driver.familyName.toUpperCase()}
        </div>
      </div>

      {/* Team */}
      <div
        className="font-rajdhani text-sm font-semibold tracking-wider mb-4"
        style={{ color: teamColor }}
      >
        {constructor?.name || "—"}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-f1dark/60 rounded-lg p-2 text-center border border-f1border/50">
          <div className="font-orbitron font-bold text-white text-base">
            {standing.points}
          </div>
          <div className="font-rajdhani text-f1muted text-[10px] tracking-widest uppercase">
            Pts
          </div>
        </div>
        <div className="bg-f1dark/60 rounded-lg p-2 text-center border border-f1border/50">
          <div className="font-orbitron font-bold text-white text-base">
            {standing.wins}
          </div>
          <div className="font-rajdhani text-f1muted text-[10px] tracking-widest uppercase">
            Wins
          </div>
        </div>
        <div className="bg-f1dark/60 rounded-lg p-2 text-center border border-f1border/50">
          <div className="font-orbitron font-bold text-white text-base">
            {driver.permanentNumber || "—"}
          </div>
          <div className="font-rajdhani text-f1muted text-[10px] tracking-widest uppercase">
            No.
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 30px ${teamColor}10` }} />
    </motion.div>
  );
}
