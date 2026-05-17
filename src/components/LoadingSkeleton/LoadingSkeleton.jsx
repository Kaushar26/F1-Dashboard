import { motion } from "framer-motion";

function SkeletonBox({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded bg-f1card ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function DriverCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5 border border-f1border">
      <div className="flex items-start gap-4">
        <SkeletonBox className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-4 w-2/3" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
        <SkeletonBox className="w-10 h-10 rounded-lg" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <SkeletonBox key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 border border-f1border">
      <div className="flex items-center gap-4 mb-4">
        <SkeletonBox className="w-16 h-8 rounded" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-4 w-3/4" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonBox className="h-2 w-full rounded-full mb-4" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBox className="h-16 rounded-lg" />
        <SkeletonBox className="h-16 rounded-lg" />
      </div>
    </div>
  );
}

export function RaceCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5 border border-f1border">
      <SkeletonBox className="h-5 w-1/3 mb-3" />
      <SkeletonBox className="h-4 w-2/3 mb-2" />
      <SkeletonBox className="h-3 w-1/2 mb-4" />
      <SkeletonBox className="h-8 w-full rounded" />
    </div>
  );
}

export default SkeletonBox;
