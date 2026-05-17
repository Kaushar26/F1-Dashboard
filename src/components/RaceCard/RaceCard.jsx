import { motion } from "framer-motion";

const COUNTRY_FLAGS = {
  Australia: "🇦🇺", Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", Italy: "🇮🇹", Monaco: "🇲🇨",
  Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹", UK: "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱", Singapore: "🇸🇬",
  Azerbaijan: "🇦🇿", Mexico: "🇲🇽", Brazil: "🇧🇷", "United States": "🇺🇸",
  UAE: "🇦🇪", Qatar: "🇶🇦", "Abu Dhabi": "🇦🇪", France: "🇫🇷",
  Germany: "🇩🇪", Portugal: "🇵🇹",
};

export default function RaceCard({ race, index, isPast }) {
  const date = new Date(race.date);
  const isUpcoming = date > new Date();
  const flag = COUNTRY_FLAGS[race.Circuit?.Location?.country] || "🏁";

  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`glass border rounded-xl p-5 group relative overflow-hidden transition-all duration-300 cursor-default ${
        isUpcoming
          ? "border-f1red/30 hover:border-f1red/60"
          : "border-f1border hover:border-white/10"
      }`}
    >
      {isUpcoming && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-f1red to-transparent" />
      )}

      <div className="flex items-start gap-4">
        {/* Round */}
        <div className="shrink-0 text-center">
          <div className="font-orbitron font-black text-2xl text-f1muted/40">
            {race.round <= 9 ? `0${race.round}` : race.round}
          </div>
          <div className="font-rajdhani text-[10px] text-f1muted tracking-widest uppercase">
            Round
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{flag}</span>
            <span className="font-orbitron font-bold text-white text-sm truncate">
              {race.raceName?.replace(" Grand Prix", "").toUpperCase()} GP
            </span>
          </div>
          <div className="font-rajdhani text-f1muted text-sm">
            {race.Circuit?.circuitName}
          </div>
          <div className="font-rajdhani text-f1muted text-sm">
            {race.Circuit?.Location?.locality}, {race.Circuit?.Location?.country}
          </div>
        </div>

        {/* Date */}
        <div className="shrink-0 text-right">
          <div className={`font-orbitron font-bold text-sm ${isUpcoming ? "text-f1red" : "text-f1muted"}`}>
            {formatted}
          </div>
          {isUpcoming && (
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-rajdhani text-[10px] text-f1red tracking-widest uppercase text-right mt-1"
            >
              UPCOMING
            </motion.div>
          )}
          {isPast && (
            <div className="font-rajdhani text-[10px] text-f1muted tracking-widest uppercase text-right mt-1">
              COMPLETED
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
