# ⚡ VelocityType Pro – Ultimate Typing Speed Challenge

> A professional, precision typing engine and speed challenge platform inspired by Monkeytype, TypeRacer, and competitive esports typing rigs. Built with a unified **MERN** and **NestJS-patterned** architecture contained completely inside one clean project directory (zero fragmented backend subfolders).

---

## 🌟 Key Features

### 1. 🎯 Precision Typing Engine
- **Instantaneous Real-Time Metrics**: Live Gross WPM, Net WPM, CPM, and dynamic Accuracy % updated every keystroke and second.
- **Micro-Smooth Caret**: Configurable caret styles:
  - *Smooth Line* (sliding dynamic pulse)
  - *Full Block* (terminal style)
  - *Underline* (classic prompt)
  - *Pulsing Bar*
- **Accurate Character Differential**: Distinct color-coded visual feedback for correct letters, mistyped letters, extra letters, and untyped characters with auto-scrolling viewport.
- **Pro Keystroke Shortcuts**:
  - `Tab + Enter`: Instant test restart
  - `Esc`: Cancel or reset session
  - `Ctrl + Backspace`: Delete whole active word
  - `Space`: Submit word & advance
- **Caps Lock Guard**: Floating responsive banner when Caps Lock is enabled.

### 2. 🎛️ Comprehensive Challenge Modes
- **⏱️ Time Limits**: 15s, 30s, 60s, 120s rapid tests.
- **📝 Word Limits**: 10, 25, 50, 100 word stamina tests.
- **💬 Famous Quotes**: Quotes by Steve Jobs, Alan Turing, Ada Lovelace, Albert Einstein, Marcus Aurelius, Carl Sagan, Marie Curie, etc., with real author attribution.
- **💻 Code Snippet Mode**: Real syntax challenges for developers (JavaScript, TypeScript, Python, Rust, HTML) practicing syntax, braces, brackets, and operators.
- **🧘 Zen Mode**: Endless flow-state typing practice with zero timer pressure.
- **⚙️ Custom Text Mode**: Paste your own articles, legal briefs, essays, or book excerpts.

### 3. 🔊 Web Audio Mechanical Keyboard Synthesizer
- Zero external MP3 network dependencies! Real-time procedural audio synthesis using the Web Audio API:
  - **Cherry MX Blue**: Tactile crisp click with metallic case resonance.
  - **Cherry MX Brown**: Damped mechanical "thock".
  - **Vintage Typewriter**: Heavy mechanical punch + typewriter bell strike.
  - **Bubble Pop**: Modern soothing ASMR water pop.
  - **Volume Slider** & **Mute Toggle**.

### 4. 📊 Performance Analytics & Interactive Visuals
- **Dynamic Progression Chart**: SVG timeline plotting Net WPM vs Raw WPM second-by-second with red error dots marking exact mistake points.
- **Keystroke Diagnostic Matrix**: Correct, Incorrect, Extra, and Missed keystroke breakdown.
- **Weak Keys Heatmap**: Detects and highlights your most frequent mistake keys (e.g. `'p'`, `';'`) to focus your practice.
- **Rhythm Consistency Metric**: Measures keystroke variance and rhythm uniformity (0-100%).
- **Celebratory Confetti Explosion**: Powered by `canvas-confetti` when achieving high scores or breaking a Personal Best!
- **Share Result Card**: One-click clipboard copy with formatted ASCII summary for Discord, Twitter/X, and Reddit.

### 5. 🏆 Global Leaderboard & Player Profile
- **Global Leaderboard**: Realistic top-tier world records with Gold 👑, Silver 🥈, Bronze 🥉 medals and live user rank updates.
- **Mode-Specific Filters**: Filter rankings by Time, Words, Quotes, and Code.
- **Career Stats Profile**: Personal Best (PB), Average WPM, Overall Accuracy, Total Tests Taken, and Total Time Typed.
- **Historical Session Log**: Detailed log of past tests with timestamps.

### 6. 🎨 Designer Color Themes & Typography
- **Midnight Cyber** (Deep slate, electric indigo & neon cyan)
- **Canary Gold** (Monkeytype beloved dark charcoal & banana yellow)
- **Dracula Synth** (Midnight purple & neon pink/green)
- **Matcha Forest** (Dark forest moss & emerald mint)
- **Nordic Clean** (Crisp high-contrast light theme)
- **Espresso Dusk** (Warm roasted coffee & amber)
- **Typography switcher**: *JetBrains Mono*, *Fira Code*, *Roboto Mono*, *Inter*.

---

## 🏗️ Architecture & Technology Stack

The project fulfills the user specification: **"no backend folder needed creat it all in project folder . in this project use mern and nest js"**:

- **Unified Single-Folder Architecture**: Everything is self-contained directly inside the project root without separate disjointed outer folders.
- **Frontend Stack (MERN)**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti.
- **NestJS-Patterned Architecture (`src/backend/`)**:
  - `controllers/leaderboard.controller.ts`
  - `services/leaderboard.nest-service.ts`
  - `dto/create-score.dto.ts` (with strict schema validation)
- **Standalone Node/Express REST API (`api-server.mjs`)**:
  - Direct REST endpoints: `GET /api/leaderboard`, `POST /api/leaderboard`, `GET /api/health`
  - Local database file `server-db.json` with zero database setup required.

---

## 🚀 Getting Started

### 1. Run the Frontend Web Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. (Optional) Run the Integrated NestJS/MERN REST API Server
```bash
node api-server.mjs
```
The REST API will start on [http://localhost:5050](http://localhost:5050).

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.
