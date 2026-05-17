import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { getConstructorStandings } from "../../services/api";
import TeamCard from "../../components/TeamCard/TeamCard";
import { TeamCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton";

export default function Teams() {
  const { data: standings, loading, error } = useFetch(getConstructorStandings);
  const maxPoints = standings ? parseFloat(standings[0]?.points || 1) : 1;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-f1red" />
            <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">
              Constructor Championship
            </span>
          </div>
          <h1 className="font-orbitron font-black text-white text-4xl md:text-5xl mb-3">
            TEAM STANDINGS
          </h1>
          <p className="font-rajdhani text-f1muted text-lg max-w-xl">
            Constructor championship points, wins, and team rankings for the current season.
          </p>
        </motion.div>

        {error && (
          <div className="glass-red border border-f1red/30 rounded-xl p-6 mb-8 text-center">
            <div className="font-orbitron text-f1red text-sm">API ERROR</div>
            <div className="font-rajdhani text-f1muted mt-1">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? [...Array(10)].map((_, i) => <TeamCardSkeleton key={i} />)
            : standings?.map((standing, i) => (
                <TeamCard
                  key={standing.Constructor.constructorId}
                  standing={standing}
                  index={i}
                  maxPoints={maxPoints}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
