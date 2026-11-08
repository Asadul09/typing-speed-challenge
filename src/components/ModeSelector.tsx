import React from 'react';
import { 
  Clock, 
  FileText, 
  Quote, 
  Code2, 
  Feather, 
  Edit3,
  Sliders
} from 'lucide-react';
import { TypingMode, TimeLimit, WordLimit } from '../types';

interface ModeSelectorProps {
  mode: TypingMode;
  timeLimit: TimeLimit;
  wordLimit: WordLimit;
  quoteCategory: string;
  codeLanguage: string;
  onSelectMode: (mode: TypingMode) => void;
  onSelectTimeLimit: (limit: TimeLimit) => void;
  onSelectWordLimit: (limit: WordLimit) => void;
  onSelectQuoteCategory: (category: string) => void;
  onSelectCodeLanguage: (lang: string) => void;
  onOpenCustomTextModal: () => void;
  accentColor: string;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  timeLimit,
  wordLimit,
  quoteCategory,
  codeLanguage,
  onSelectMode,
  onSelectTimeLimit,
  onSelectWordLimit,
  onSelectQuoteCategory,
  onSelectCodeLanguage,
  onOpenCustomTextModal,
  accentColor,
  disabled = false
}) => {
  const modes: { id: TypingMode; label: string; icon: React.ReactNode }[] = [
    { id: 'time', label: 'Time', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'words', label: 'Words', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'zen', label: 'Zen', icon: <Feather className="w-3.5 h-3.5" /> },
    { id: 'custom', label: 'Custom', icon: <Edit3 className="w-3.5 h-3.5" /> }
  ];

  const timeLimits: TimeLimit[] = [15, 30, 60, 120];
  const wordLimits: WordLimit[] = [10, 25, 50, 100];
  const quoteCategories = [
    { id: 'all', label: 'All' },
    { id: 'tech', label: 'Tech' },
    { id: 'wisdom', label: 'Wisdom' },
    { id: 'philosophy', label: 'Philosophy' }
  ];
  const codeLanguages = [
    { id: 'all', label: 'All' },
    { id: 'javascript', label: 'JS' },
    { id: 'typescript', label: 'TS' },
    { id: 'python', label: 'Python' },
    { id: 'rust', label: 'Rust' }
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      {/* Mode Pills Container */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
        {/* Main Modes */}
        <div className="flex items-center gap-1 p-0.5">
          {modes.map(m => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMode(m.id);
                  if (m.id === 'custom') {
                    onOpenCustomTextModal();
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                style={isActive ? { backgroundColor: accentColor } : {}}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div className="w-[1px] h-5 bg-slate-800 mx-1 hidden sm:block" />

        {/* Sub-options based on active mode */}
        <div className="flex items-center gap-1 p-0.5">
          {mode === 'time' && (
            <>
              {timeLimits.map(t => (
                <button
                  key={t}
                  onClick={() => onSelectTimeLimit(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    timeLimit === t
                      ? 'text-white bg-slate-800 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={timeLimit === t ? { color: accentColor } : {}}
                >
                  {t}s
                </button>
              ))}
            </>
          )}

          {mode === 'words' && (
            <>
              {wordLimits.map(w => (
                <button
                  key={w}
                  onClick={() => onSelectWordLimit(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    wordLimit === w
                      ? 'text-white bg-slate-800 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={wordLimit === w ? { color: accentColor } : {}}
                >
                  {w}
                </button>
              ))}
            </>
          )}

          {mode === 'quote' && (
            <>
              {quoteCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onSelectQuoteCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    quoteCategory === cat.id
                      ? 'text-white bg-slate-800 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={quoteCategory === cat.id ? { color: accentColor } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </>
          )}

          {mode === 'code' && (
            <>
              {codeLanguages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => onSelectCodeLanguage(lang.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    codeLanguage === lang.id
                      ? 'text-white bg-slate-800 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={codeLanguage === lang.id ? { color: accentColor } : {}}
                >
                  {lang.label}
                </button>
              ))}
            </>
          )}

          {mode === 'zen' && (
            <span className="text-xs text-slate-400 px-2 py-0.5 font-mono italic">
              Flow state active • Press Esc or Tab+Enter to finish
            </span>
          )}

          {mode === 'custom' && (
            <button
              onClick={onOpenCustomTextModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700"
            >
              <Sliders className="w-3 h-3 text-slate-400" />
              Edit Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
