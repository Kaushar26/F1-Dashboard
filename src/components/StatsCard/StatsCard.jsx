import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Animated counter
function Counter({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0);
  const target = parseFloat(value) || 0;

  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{display}</span>;
}

export default function StatsCard({ label, value, icon, accent = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative rounded-xl p-4 border overflow-hidden group cursor-default ${
        accent
          ? "glass-red border-f1red/30"
          : "glass border-f1border hover:border-f1red/30"
      } transition-all duration-300`}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-f1red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      <div className="relative z-10">
        {icon && (
          <div className="text-f1red text-lg mb-2">{icon}</div>
        )}
        <div className={`font-orbitron font-bold text-2xl ${accent ? "text-f1red text-glow" : "text-white"}`}>
          <Counter value={value} />
        </div>
        <div className="font-rajdhani text-f1muted text-sm tracking-wider uppercase mt-1">
          {label}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${accent ? "bg-f1red" : "bg-f1red/0 group-hover:bg-f1red/50"} transition-colors duration-300`} />
    </motion.div>
  );
}
