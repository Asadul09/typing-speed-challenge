import React from 'react';
import { HelpCircle, X, Command } from 'lucide-react';
import { ThemeColors } from '../types';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeColors;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Tab + Enter', desc: 'Instantly restart current typing challenge' },
    { key: 'Esc', desc: 'Reset or cancel the active session' },
    { key: 'Ctrl + Backspace', desc: 'Delete the entire current word' },
    { key: 'Space', desc: 'Submit word and advance to next word' },
    { key: 'Caps Lock', desc: 'Triggers active warning banner if accidentally on' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md flex flex-col rounded-3xl glass-panel border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
            >
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Power-user keys for seamless practice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-6 divide-y divide-slate-800/60">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-indigo-300 shadow">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-white text-xs font-semibold shadow"
            style={{ backgroundColor: theme.primary }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
