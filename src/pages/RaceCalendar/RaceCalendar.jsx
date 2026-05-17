import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { getRaceSchedule } from "../../services/api";
import RaceCard from "../../components/RaceCard/RaceCard";
import { RaceCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton";

export default function RaceCalendar() {
  const { data: races, loading, error } = useFetch(getRaceSchedule);
  const now = new Date();

  const upcoming = races?.filter((r) => new Date(r.date) >= now) || [];
  const past = races?.filter((r) => new Date(r.date) < now) || [];
  const nextRace = upcoming[0];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-f1red" />
            <span className="font-orbitron text-f1red text-xs tracking-[0.3em] uppercase">
              Season Schedule
            </span>
          </div>
          <h1 className="font-orbitron font-black text-white text-4xl md:text-5xl mb-3">
            RACE CALENDAR
          </h1>
          <p className="font-rajdhani text-f1muted text-lg">
            Full season schedule — upcoming races and completed rounds.
          </p>
        </motion.div>

        {/* Next Race Hero */}
        {!loading && nextRace && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-red border border-f1red/30 rounded-2xl p-8 mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-f1red to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-f1red/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 bg-f1red rounded-full"
                />
                <span className="font-orbitron text-f1red text-xs tracking-widest">NEXT RACE</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="font-rajdhani text-f1muted text-sm tracking-widest uppercase mb-1">
                    Round {nextRace.round}
                  </div>
                  <div className="font-orbitron font-black text-white text-2xl md:text-3xl mb-2">
                    {nextRace.raceName?.toUpperCase()}
                  </div>
                  <div className="font-rajdhani text-f1muted">
                    {nextRace.Circuit?.circuitName}
                  </div>
                  <div className="font-rajdhani text-f1muted">
                    {nextRace.Circuit?.Location?.locality}, {nextRace.Circuit?.Location?.country}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-rajdhani text-f1muted text-sm w-20">Race Date</span>
                    <span className="font-orbitron text-f1red text-sm">
                      {new Date(nextRace.date).toLocaleDateString("en-GB", {
                        weekday: "short", day: "2-digit", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                  {nextRace.time && (
                    <div className="flex items-center gap-3">
                      <span className="font-rajdhani text-f1muted text-sm w-20">Race Time</span>
                      <span className="font-orbitron text-white text-sm">{nextRace.time} UTC</span>
                    </div>
                  )}
                  {nextRace.FirstPractice && (
                    <div className="flex items-center gap-3">
                      <span className="font-rajdhani text-f1muted text-sm w-20">FP1</span>
                      <span className="font-rajdhani text-f1muted text-sm">
                        {nextRace.FirstPractice.date}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="glass-red border border-f1red/30 rounded-xl p-6 mb-8 text-center">
            <div className="font-orbitron text-f1red text-sm">API ERROR</div>
            <div className="font-rajdhani text-f1muted mt-1">{error}</div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-orbitron text-white text-sm tracking-widest">UPCOMING</span>
              <span className="font-orbitron text-f1red text-xs glass-red border border-f1red/30 px-2 py-0.5 rounded">
                {upcoming.length}
              </span>
              <div className="h-px flex-1 bg-f1border" />
            </div>
            <div className="space-y-3">
              {loading
                ? [...Array(5)].map((_, i) => <RaceCardSkeleton key={i} />)
                : upcoming.map((race, i) => (
                    <RaceCard key={race.round} race={race} index={i} />
                  ))}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-orbitron text-f1muted text-sm tracking-widest">COMPLETED</span>
              <span className="font-orbitron text-f1muted text-xs glass border border-f1border px-2 py-0.5 rounded">
                {past.length}
              </span>
              <div className="h-px flex-1 bg-f1border" />
            </div>
            <div className="space-y-3">
              {loading
                ? [...Array(5)].map((_, i) => <RaceCardSkeleton key={i} />)
                : [...past].reverse().map((race, i) => (
                    <RaceCard key={race.round} race={race} index={i} isPast />
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
