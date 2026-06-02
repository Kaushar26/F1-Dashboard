import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Drivers from "./pages/Drivers/Drivers";
import Teams from "./pages/Teams/Teams";
import RaceCalendar from "./pages/RaceCalendar/RaceCalendar";
import Comparison from "./pages/Comparison/Comparison";
import Analytics from "./pages/Analytics/Analytics";

// Ticker bar at bottom
// function TickerBar() {
//   const items = [
//     "🏁 F1 TELEMETRY DASHBOARD",
//     "📊 LIVE STANDINGS",
//     "🔴 DRIVER COMPARISON",
//     "🏎️ RACE CALENDAR",
//     "📈 ANALYTICS",
//     "⚡ REAL-TIME DATA",
//   ];
//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-40 h-7 bg-f1red/10 border-t border-f1red/20 overflow-hidden flex items-center">
//       <div className="animate-ticker flex gap-16 whitespace-nowrap">
//         {[...items, ...items].map((item, i) => (
//           <span key={i} className="font-orbitron text-[10px] text-f1red/60 tracking-widest">
//             {item}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

function AppContent() {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/calendar" element={<RaceCalendar />} />
            <Route path="/compare" element={<Comparison />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
