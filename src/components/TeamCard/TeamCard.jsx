import { motion } from "framer-motion";
import { getTeamColor } from "../../services/api";

export default function TeamCard({ standing, index, maxPoints }) {
  const constructor = standing.Constructor;
  const teamColor = getTeamColor(constructor.constructorId);
  const points = parseFloat(standing.points);
  const barWidth = maxPoints ? (points / maxPoints) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass border border-f1border hover:border-white/10 rounded-xl p-6 cursor-default group relative overflow-hidden transition-all duration-300"
    >
      {/* Left border accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: teamColor }}
      />

      {/* Position */}
      <div className="flex items-start justify-between mb-4 pl-3">
        <div>
          <div className="font-orbitron font-black text-4xl text-f1muted/30">
            {standing.position <= 9 ? `0${standing.position}` : standing.position}
          </div>
        </div>
        <div
          className="font-orbitron font-bold text-xs px-2 py-1 rounded border"
          style={{ color: teamColor, borderColor: `${teamColor}40`, backgroundColor: `${teamColor}10` }}
        >
          P{standing.position}
        </div>
      </div>

      {/* Team Name */}
      <div className="pl-3 mb-4">
        <div className="font-orbitron font-bold text-white text-base tracking-wide leading-tight">
          {constructor.name.toUpperCase()}
        </div>
        <div className="font-rajdhani text-f1muted text-sm tracking-wider mt-0.5">
          {constructor.nationality}
        </div>
      </div>

      {/* Points bar */}
      <div className="pl-3 mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-rajdhani text-f1muted text-xs tracking-widest uppercase">Points</span>
          <span className="font-orbitron font-bold text-white text-sm">{standing.points}</span>
        </div>
        <div className="h-1.5 bg-f1dark rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ delay: index * 0.07 + 0.4, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: teamColor }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="pl-3 grid grid-cols-2 gap-3">
        <div className="bg-f1dark/60 rounded-lg p-3 border border-f1border/50">
          <div className="font-orbitron font-bold text-white text-xl">{standing.wins}</div>
          <div className="font-rajdhani text-f1muted text-[10px] tracking-widest uppercase">Wins</div>
        </div>
        <div className="bg-f1dark/60 rounded-lg p-3 border border-f1border/50">
          <div className="font-orbitron font-bold text-white text-xl">{standing.points}</div>
          <div className="font-rajdhani text-f1muted text-[10px] tracking-widest uppercase">Total Pts</div>
        </div>
      </div>
    </motion.div>
  );
}
