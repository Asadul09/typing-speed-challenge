import React from 'react';
import { 
  Settings, 
  X, 
  Volume2, 
  Palette, 
  Type, 
  MousePointer, 
  Sliders, 
  ShieldAlert, 
  Play,
  EyeOff
} from 'lucide-react';
import { 
  TypingSettings, 
  ThemeColors, 
  SoundProfile, 
  CaretStyle, 
  FontFamily 
} from '../types';
import { THEMES } from '../constants/themes';
import { soundSynthesizer } from '../services/soundSynthesizer.service';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TypingSettings;
  onUpdateSettings: (newSettings: Partial<TypingSettings>) => void;
  theme: ThemeColors;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  theme
}) => {
  if (!isOpen) return null;

  const testAudio = (profile: SoundProfile) => {
    soundSynthesizer.playKeySound(profile, 'a');
  };

  const soundProfiles: { id: SoundProfile; name: string; desc: string }[] = [
    { id: 'cherry-blue', name: 'Cherry MX Blue', desc: 'Crisp mechanical tactile click' },
    { id: 'cherry-brown', name: 'Cherry MX Brown', desc: 'Deep damped mechanical thock' },
    { id: 'typewriter', name: 'Vintage Typewriter', desc: 'Classic metal hammer & bell strike' },
    { id: 'pop', name: 'Bubble Pop', desc: 'Satisfying soft water bubble pop' },
    { id: 'off', name: 'Mute / Off', desc: 'Silent keystrokes' }
  ];

  const caretStyles: { id: CaretStyle; name: string }[] = [
    { id: 'line', name: 'Smooth Line' },
    { id: 'block', name: 'Full Block' },
    { id: 'underline', name: 'Underline' },
    { id: 'pulse', name: 'Pulsing Bar' }
  ];

  const fontFamilies: FontFamily[] = [
    'JetBrains Mono',
    'Fira Code',
    'Roboto Mono',
    'Inter'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Preferences & Customization</h3>
              <p className="text-xs text-slate-400">Tailor sound, visual themes, caret, and behavior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Sound Preferences */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-white">Keyboard Audio Feedback</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Vol: {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings({ soundVolume: val });
                  soundSynthesizer.setVolume(val);
                }}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            {/* Sound Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {soundProfiles.map(sp => {
                const isSelected = settings.soundProfile === sp.id;
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      onUpdateSettings({ soundProfile: sp.id });
                      testAudio(sp.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/50 shadow'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{sp.name}</div>
                      <div className="text-[11px] text-slate-400">{sp.desc}</div>
                    </div>
                    {sp.id !== 'off' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          testAudio(sp.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Test sound"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Color Themes</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES.map(th => {
                const isSelected = settings.themeId === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => onUpdateSettings({ themeId: th.id })}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                    style={{ backgroundColor: th.surface }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold" style={{ color: th.textMain }}>
                        {th.name}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.primary }} />
                    </div>
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.background }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.primary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.caretColor }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caret & Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Caret Style */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Caret Style</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {caretStyles.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onUpdateSettings({ caretStyle: c.id })}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      settings.caretStyle === c.id
                        ? 'bg-slate-800 border-indigo-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Font Family</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {fontFamilies.map(f => (
                  <button
                    key={f}
                    onClick={() => onUpdateSettings({ fontFamily: f })}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      settings.fontFamily === f
                        ? 'bg-slate-800 border-indigo-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gameplay Toggles */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Gameplay Options
            </h4>

            <div className="space-y-2">
              {/* Confidence Mode */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Confidence Mode
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Disables backspace key entirely — forces forward accuracy.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.confidenceMode}
                  onChange={e => onUpdateSettings({ confidenceMode: e.target.checked })}
                  className="accent-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Show Live Stats */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
                <div>
                  <div className="text-xs font-semibold text-white">Live Speed & Accuracy Ticker</div>
                  <div className="text-[11px] text-slate-400">
                    Display instantaneous WPM and Accuracy during typing test.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showLiveWpm}
                  onChange={e => onUpdateSettings({ showLiveWpm: e.target.checked })}
                  className="accent-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Indicate Caps Lock */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
                <div>
                  <div className="text-xs font-semibold text-white">Caps Lock Indicator</div>
                  <div className="text-[11px] text-slate-400">
                    Alert banner whenever Caps Lock is inadvertently active.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.indicateCapslock}
                  onChange={e => onUpdateSettings({ indicateCapslock: e.target.checked })}
                  className="accent-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-white text-xs font-semibold shadow"
            style={{ backgroundColor: theme.primary }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
