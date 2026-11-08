import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Share2, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Target, 
  Zap, 
  Activity, 
  BarChart2, 
  Sparkles,
  Check
} from 'lucide-react';
import { TestResult, ThemeColors } from '../types';

interface ResultsModalProps {
  result: TestResult;
  theme: ThemeColors;
  isPersonalBest?: boolean;
  onRestart: () => void;
  onSaveToLeaderboard: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  theme,
  isPersonalBest = false,
  onRestart,
  onSaveToLeaderboard,
  onOpenLeaderboard
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fire celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: isPersonalBest ? 120 : 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore if canvas not supported
    }
  }, [isPersonalBest]);

  // Determine Rank Tier
  const getRankTier = (wpm: number) => {
    if (wpm >= 130) return { label: 'Mythic Typist', badge: '👑 Mythic', color: '#f59e0b', desc: 'Top 0.5% in the world!' };
    if (wpm >= 100) return { label: 'Speed Demon', badge: '⚡ Speed Demon', color: '#6366f1', desc: 'Faster than 95% of typists.' };
    if (wpm >= 80) return { label: 'Pro Typist', badge: '🚀 Pro Typist', color: '#10b981', desc: 'Well above professional standard.' };
    if (wpm >= 60) return { label: 'Fast Keyboarder', badge: '✨ Fast', color: '#38bdf8', desc: 'Solid speed and fluent rhythm.' };
    return { label: 'Apprentice', badge: '🌱 Apprentice', color: '#94a3b8', desc: 'Great practice session! Keep pushing.' };
  };

  const tier = getRankTier(result.wpm);

  // Copy shareable summary to clipboard
  const handleCopySummary = async () => {
    const text = `⚡ VelocityType Challenge Result:
Speed: ${result.wpm} WPM (Raw: ${result.rawWpm} WPM)
Accuracy: ${result.accuracy}%
Consistency: ${result.consistency}%
Mode: ${result.mode.toUpperCase()} (${result.modeDetail})
Tier: ${tier.badge}
${isPersonalBest ? '🏆 NEW PERSONAL BEST!' : ''}
Practice now on VelocityType Pro!`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSaveScore = () => {
    onSaveToLeaderboard();
    setSaved(true);
  };

  // Prepare points for SVG chart
  const history = result.wpmHistory.length > 0 
    ? result.wpmHistory 
    : [{ second: 1, wpm: result.wpm, rawWpm: result.rawWpm, errors: 0 }];

  const maxWpm = Math.max(100, ...history.map(h => Math.max(h.wpm, h.rawWpm))) + 15;
  const maxSec = Math.max(1, history[history.length - 1]?.second || result.timeElapsed);

  const getSvgCoordinates = (sec: number, wpm: number) => {
    const x = (sec / maxSec) * 560 + 20; // 600 width viewBox
    const y = 180 - (wpm / maxWpm) * 150; // 200 height viewBox
    return { x, y };
  };

  const netPointsString = history
    .map(h => {
      const { x, y } = getSvgCoordinates(h.second, h.wpm);
      return `${x},${y}`;
    })
    .join(' ');

  const rawPointsString = history
    .map(h => {
      const { x, y } = getSvgCoordinates(h.second, h.rawWpm);
      return `${x},${y}`;
    })
    .join(' ');

  const errorPoints = history.filter(h => h.errors > 0);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {tier.badge}
            </span>
            {isPersonalBest && (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                🏆 New Personal Best!
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Test Performance Summary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {tier.desc} • Mode: <span className="text-slate-200 font-mono capitalize">{result.mode} ({result.modeDetail})</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all shadow"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copied Card!' : 'Share Result'}</span>
          </button>

          <button
            onClick={handleSaveScore}
            disabled={saved}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              saved 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{saved ? 'Saved to Board!' : 'Save Score'}</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: theme.primary }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Quad */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {/* WPM */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Net Speed</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: theme.primary }}>
              {result.wpm}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1.5 font-mono">WPM</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Raw: <span className="text-slate-300">{result.rawWpm} WPM</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-400">
              {result.accuracy}%
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Keystrokes: <span className="text-slate-300">{result.correctKeystrokes}/{result.totalKeystrokes}</span>
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Test Duration</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-sky-300">
              {result.timeElapsed}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1.5 font-mono">sec</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            CPM: <span className="text-slate-300">{result.cpm} char/min</span>
          </div>
        </div>

        {/* Consistency */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Consistency</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-amber-300">
              {result.consistency}%
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Rhythm standard variance
          </div>
        </div>
      </div>

      {/* Interactive WPM Progression Chart */}
      <div className="w-full p-5 rounded-2xl bg-slate-900/80 border border-slate-800 my-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Speed & Accuracy Timeline
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
              <span className="text-slate-400">Net WPM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-400">Raw WPM</span>
            </div>
            {errorPoints.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-slate-400">Errors</span>
              </div>
            )}
          </div>
        </div>

        {/* SVG Curve */}
        <div className="w-full h-44 relative">
          <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
            {/* Horizontal Grid lines */}
            <line x1="20" y1="30" x2="580" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="20" y1="105" x2="580" y2="105" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="20" y1="180" x2="580" y2="180" stroke="#334155" />

            {/* Raw WPM line (gray) */}
            {rawPointsString && (
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="3 3"
                points={rawPointsString}
              />
            )}

            {/* Net WPM line (theme primary) */}
            {netPointsString && (
              <polyline
                fill="none"
                stroke={theme.primary}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={netPointsString}
              />
            )}

            {/* Error markers */}
            {errorPoints.map((pt, i) => {
              const { x, y } = getSvgCoordinates(pt.second, pt.wpm);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Keystrokes Breakdown & Weak Keys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Keystrokes Table */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Keystrokes Breakdown
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-xs text-slate-400">Correct</div>
              <div className="text-lg font-bold text-emerald-400">{result.correctKeystrokes}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-xs text-slate-400">Incorrect</div>
              <div className="text-lg font-bold text-red-400">{result.incorrectKeystrokes}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-xs text-slate-400">Extra</div>
              <div className="text-lg font-bold text-amber-400">{result.extraKeystrokes}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-xs text-slate-400">Missed</div>
              <div className="text-lg font-bold text-slate-400">{result.missedKeystrokes}</div>
            </div>
          </div>
        </div>

        {/* Weak Keys Heatmap */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Keys Needing Practice
          </h4>
          {Object.keys(result.weakKeys).length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium py-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Flawless typing! Zero repeated key errors recorded.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.weakKeys).slice(0, 6).map(([key, count]) => (
                <div 
                  key={key} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono"
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-100 font-bold uppercase">
                    {key === ' ' ? 'Space' : key}
                  </kbd>
                  <span className="text-red-400 font-semibold">{count} errors</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
