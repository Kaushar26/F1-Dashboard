import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { getDriverStandings } from "../../services/api";
import DriverCard from "../../components/DriverCard/DriverCard";
import { DriverCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton";

export default function Drivers() {
  const { data: standings, loading, error } = useFetch(getDriverStandings);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-f1red" />
            <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">
              Current Season
            </span>
          </div>
          <h1 className="font-orbitron font-black text-white text-4xl md:text-5xl mb-3">
            DRIVER STANDINGS
          </h1>
          <p className="font-rajdhani text-f1muted text-lg max-w-xl">
            Live driver championship standings — points, wins, and team assignments.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="glass-red border border-f1red/30 rounded-xl p-6 mb-8 text-center">
            <div className="font-orbitron text-f1red text-sm">API ERROR</div>
            <div className="font-rajdhani text-f1muted mt-1">{error}</div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? [...Array(20)].map((_, i) => <DriverCardSkeleton key={i} />)
            : standings?.map((standing, i) => (
                <DriverCard key={standing.Driver.driverId} standing={standing} index={i} />
              ))}
        </div>
      </div>
    </div>
  );
}
