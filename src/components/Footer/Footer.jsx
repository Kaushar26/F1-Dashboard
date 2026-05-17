export default function Footer() {
  return (
    <footer className="border-t border-f1border mt-20 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-f1red rounded-sm rotate-12 flex items-center justify-center">
            <span className="font-orbitron font-black text-white text-[9px]">F1</span>
          </div>
          <span className="font-orbitron text-xs text-f1muted tracking-widest">
            TELEMETRY DASHBOARD
          </span>
        </div>
        <div className="font-rajdhani text-f1muted text-sm text-center">
          Data provided by{" "}
          <a
            href="https://ergast.com/mrd/"
            target="_blank"
            rel="noreferrer"
            className="text-f1red hover:underline"
          >
            Ergast Developer API
          </a>{" "}
          · Not affiliated with Formula 1®
        </div>
        <div className="font-rajdhani text-f1muted text-xs tracking-widest">
          © {new Date().getFullYear()} · PORTFOLIO PROJECT
        </div>
      </div>
    </footer>
  );
}
