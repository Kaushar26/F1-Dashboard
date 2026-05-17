# 🏎️ F1 Telemetry & Race Analytics Dashboard

A cinematic, full-stack Formula 1 analytics platform built with React, Tailwind CSS, and Framer Motion. Inspired by modern motorsport broadcast graphics and Ferrari/Red Bull garage telemetry systems.

---

## 🚀 Features

- **Driver Standings** — Live championship standings with animated glassmorphism cards
- **Constructor Standings** — Team rankings with color-coded progress bars
- **Race Calendar** — Full season schedule with upcoming race highlight
- **Driver Comparison** — Head-to-head analytics with Radar, Bar, and Line charts
- **Analytics Dashboard** — Telemetry-style data visualizations and season insights
- **Live data** via [Ergast Developer API](https://ergast.com/mrd/)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| Data | Ergast F1 API |
| Fonts | Orbitron + Rajdhani |

---

## 📦 Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone / unzip the project
cd f1-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — select Vite as framework
```

Or connect your GitHub repo directly on [vercel.com](https://vercel.com) for automatic deployments.

**vercel.json** (create in root if needed):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar/          # Responsive nav with active indicator
│   ├── DriverCard/      # Driver standing card
│   ├── TeamCard/        # Constructor card with team colors
│   ├── RaceCard/        # Race schedule card
│   ├── StatsCard/       # Animated counter stat card
│   ├── LoadingSkeleton/ # Shimmer loading states
│   └── Footer/          # Footer with API attribution
├── pages/
│   ├── Home/            # Hero + live preview sections
│   ├── Drivers/         # Full driver standings grid
│   ├── Teams/           # Constructor standings grid
│   ├── RaceCalendar/    # Season schedule
│   ├── Comparison/      # Driver head-to-head analytics
│   └── Analytics/       # Charts and data visualizations
├── services/
│   └── api.js           # Ergast API calls + team colors
├── hooks/
│   └── useFetch.js      # Generic data fetching hook
└── animations/
    └── variants.js      # Shared Framer Motion variants
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Panel | `#111111` |
| Card | `#161616` |
| Border | `#2a2a2a` |
| Accent | `#E10600` (Ferrari Red) |
| Font Display | Orbitron |
| Font Body | Rajdhani |

---

## ⚠️ Notes

- **Ergast API** is free with no API key required. It may be rate-limited under heavy use.
- This is a **portfolio project** and is not affiliated with Formula 1® or any F1 team.
- The Ergast API supports seasons up to 2024. For live 2025 data, consider integrating [OpenF1 API](https://openf1.org/).

---

## 📸 Portfolio Notes

This project demonstrates:
- Real API integration with caching
- Responsive React architecture with custom hooks
- Production-grade Tailwind design system
- Framer Motion page transitions and micro-interactions
- Recharts data visualization (Radar, Bar, Line, Area)
- Glassmorphism UI and motorsport-inspired aesthetics

---

*Built with ❤️ as a software engineering portfolio project.*
