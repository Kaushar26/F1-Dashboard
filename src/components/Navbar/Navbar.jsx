import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "ANALYTICS", path: "/analytics" },
  { label: "DRIVERS", path: "/drivers" },
  { label: "TEAMS", path: "/teams" },
  { label: "CALENDAR", path: "/calendar" },
  { label: "COMPARE", path: "/compare" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass border-b border-f1border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-f1red rounded-sm rotate-12 group-hover:rotate-6 transition-transform duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-orbitron font-black text-white text-xs">F1</span>
              </div>
            </div>
            <div>
              <div className="font-orbitron font-bold text-white text-sm tracking-widest leading-none">
                TELEMETRY
              </div>
              <div className="font-rajdhani text-f1muted text-xs tracking-[0.2em] uppercase">
                Race Analytics
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 font-orbitron text-xs tracking-widest transition-colors duration-200 ${
                    active ? "text-f1red" : "text-f1muted hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-f1red"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="menu"
          >
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-f1border md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={link.path}
                  className={`block px-6 py-4 font-orbitron text-xs tracking-widest border-b border-f1border transition-colors ${
                    location.pathname === link.path
                      ? "text-f1red bg-f1red/5"
                      : "text-f1muted hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
