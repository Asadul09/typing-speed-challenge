import React from 'react';
import { 
  Keyboard, 
  Trophy, 
  User, 
  Settings, 
  Volume2, 
  VolumeX, 
  Palette, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import { TypingSettings, UserProfile } from '../types';
import { THEMES } from '../constants/themes';
import { soundSynthesizer } from '../services/soundSynthesizer.service';

interface HeaderProps {
  profile: UserProfile;
  settings: TypingSettings;
  onUpdateSettings: (newSettings: Partial<TypingSettings>) => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  settings,
  onUpdateSettings,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenSettings,
  onOpenShortcuts,
}) => {
  const currentTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];

  const toggleSound = () => {
    if (settings.soundProfile === 'off') {
      const nextProfile = 'cherry-blue';
      onUpdateSettings({ soundProfile: nextProfile });
      soundSynthesizer.playKeySound(nextProfile, 'a');
    } else {
      onUpdateSettings({ soundProfile: 'off' });
    }
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === settings.themeId);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    onUpdateSettings({ themeId: THEMES[nextIndex].id });
  };

  return (
    <header className="w-full max-w-6xl mx-auto pt-6 pb-4 px-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/60">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: currentTheme.primary, color: '#fff' }}
        >
          <Keyboard className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
              VelocityType
              <span 
                className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                style={{ backgroundColor: currentTheme.primaryGlow, color: currentTheme.primary }}
              >
                PRO
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">Minimalist & Precision Typing Engine</p>
        </div>
      </div>

      {/* Header Quick Controls */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        {/* PB Badge */}
        {profile.bestWpm > 0 && (
          <div 
            onClick={onOpenProfile}
            title="Click to view full player profile"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-mono font-medium border border-slate-700/60 cursor-pointer transition-all hover:border-amber-500/50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="text-slate-400">PB:</span>
            <span className="text-amber-300 font-bold">{profile.bestWpm} WPM</span>
          </div>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={`Sound is ${settings.soundProfile === 'off' ? 'OFF' : `ON (${settings.soundProfile})`}. Click to toggle.`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            settings.soundProfile !== 'off'
              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          {settings.soundProfile === 'off' ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-indigo-400" />
          )}
          <span className="hidden sm:inline capitalize">
            {settings.soundProfile === 'off' ? 'Muted' : settings.soundProfile.replace('-', ' ')}
          </span>
        </button>

        {/* Theme Quick Switcher */}
        <button
          onClick={cycleTheme}
          title={`Current Theme: ${currentTheme.name}. Click to cycle.`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">{currentTheme.name}</span>
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          title="Global Leaderboards"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-amber-300 hover:text-amber-200 transition-all hover:border-amber-500/40"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Leaderboards</span>
        </button>

        {/* Profile / Stats */}
        <button
          onClick={onOpenProfile}
          title="Player Stats & History"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">{profile.username}</span>
        </button>

        {/* Shortcuts Helper */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts"
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings Modal */}
        <button
          onClick={onOpenSettings}
          title="Settings & Customization"
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
