import React, { useState } from 'react';
import { 
  Trophy, 
  X, 
  Search, 
  Medal, 
  Crown, 
  Zap, 
  Clock, 
  Filter, 
  Award, 
  RefreshCw 
} from 'lucide-react';
import { LeaderboardEntry, ThemeColors } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentUsername: string;
  theme: ThemeColors;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentUsername,
  theme
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Filter entries
  const filtered = entries.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.mode === activeFilter;
    const matchesSearch = item.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300 fill-slate-300/20" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700 fill-amber-700/20" />;
    return <span className="font-mono text-sm font-semibold text-slate-500">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Global Leaderboard</h3>
              <p className="text-xs text-slate-400">Hall of fame for elite typists worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {['all', 'time', 'words', 'quote', 'code'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeFilter === f
                    ? 'text-white bg-slate-800 border border-slate-700 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={activeFilter === f ? { color: theme.primary } : {}}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search typist..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              No matching records found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isCurrentUser = item.username.toLowerCase() === currentUsername.toLowerCase();
              const rank = item.rank || idx + 1;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between py-3.5 px-3 rounded-2xl transition-all ${
                    isCurrentUser 
                      ? 'bg-indigo-500/10 border border-indigo-500/30' 
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 flex justify-center items-center">
                      {getRankMedal(rank)}
                    </div>

                    <img
                      src={item.avatar}
                      alt={item.username}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {item.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300">
                            YOU
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono capitalize">
                        {item.mode} • {item.modeDetail}
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores */}
                  <div className="flex items-center gap-6 text-right font-mono">
                    <div className="hidden sm:block">
                      <div className="text-xs text-slate-400">Accuracy</div>
                      <div className="text-sm font-semibold text-emerald-400">{item.accuracy}%</div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">Speed</div>
                      <div className="text-lg font-black text-amber-300">
                        {item.wpm} <span className="text-xs font-normal text-slate-500">WPM</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-500">
          Rankings update dynamically upon every completed test session.
        </div>
      </div>
    </div>
  );
};
