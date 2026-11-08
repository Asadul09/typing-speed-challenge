import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  Target, 
  Clock, 
  Flame,
  Volume2
} from 'lucide-react';
import { 
  TypingMode, 
  TypingSettings, 
  TestResult, 
  WpmPoint, 
  ThemeColors 
} from '../types';
import { soundSynthesizer } from '../services/soundSynthesizer.service';

interface TypingAreaProps {
  targetText: string;
  mode: TypingMode;
  modeDetail: string;
  timeLimit: number;
  settings: TypingSettings;
  theme: ThemeColors;
  onFinishTest: (result: TestResult) => void;
  onRestartTest: () => void;
  quoteAuthor?: string;
  codeLanguage?: string;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  mode,
  modeDetail,
  timeLimit,
  settings,
  theme,
  onFinishTest,
  onRestartTest,
  quoteAuthor,
  codeLanguage
}) => {
  // Split target text into words
  const words = React.useMemo(() => targetText.split(' '), [targetText]);

  // Typing states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedHistory, setTypedHistory] = useState<string[]>([]); // words completed
  
  // Status states
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live Stats
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [liveRawWpm, setLiveRawWpm] = useState(0);

  // Analytics tracking
  const startTimeRef = useRef<number | null>(null);
  const totalKeystrokesRef = useRef<number>(0);
  const correctKeystrokesRef = useRef<number>(0);
  const incorrectKeystrokesRef = useRef<number>(0);
  const extraKeystrokesRef = useRef<number>(0);
  const missedKeystrokesRef = useRef<number>(0);
  const wpmHistoryRef = useRef<WpmPoint[]>([]);
  const weakKeysRef = useRef<Record<string, number>>({});
  const keystrokeTimestampsRef = useRef<number[]>([]);

  // DOM Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Reset when target text or time limit changes
  useEffect(() => {
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedHistory([]);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(timeLimit);
    setElapsedSeconds(0);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setLiveRawWpm(0);

    startTimeRef.current = null;
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    incorrectKeystrokesRef.current = 0;
    extraKeystrokesRef.current = 0;
    missedKeystrokesRef.current = 0;
    wpmHistoryRef.current = [];
    weakKeysRef.current = {};
    keystrokeTimestampsRef.current = [];

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [targetText, timeLimit, mode]);

  // Keep focus on input whenever clicking anywhere in the typing surface
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Scroll active word into view smoothly
  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      const container = wordsContainerRef.current;
      const element = activeWordRef.current;
      const offsetTop = element.offsetTop - container.offsetTop;
      
      // Auto-scroll if user enters line 2 or beyond
      if (offsetTop > 80) {
        container.scrollTo({
          top: offsetTop - 45,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentWordIndex]);

  // Calculate consistency (% rating of keystroke rhythm standard deviation)
  const calculateConsistency = useCallback((): number => {
    const timestamps = keystrokeTimestampsRef.current;
    if (timestamps.length < 5) return 85;

    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // Score from 0 to 100
    const consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / (mean || 1)) * 30)));
    return consistency || 80;
  }, []);

  // Complete the test and compile comprehensive report
  const completeTest = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setIsActive(false);

    const now = Date.now();
    const duration = startTimeRef.current 
      ? Math.max(1, (now - startTimeRef.current) / 1000) 
      : 1;

    // Gross WPM = (Total Keystrokes / 5) / (Minutes)
    const minutes = duration / 60;
    const totalTyped = totalKeystrokesRef.current;
    const correctTyped = correctKeystrokesRef.current;
    const rawWpm = Math.round((totalTyped / 5) / minutes) || 0;
    const netWpm = Math.max(0, Math.round((correctTyped / 5) / minutes)) || 0;
    const cpm = Math.round(correctTyped / minutes) || 0;

    const accuracy = totalTyped > 0 
      ? Math.round((correctTyped / totalTyped) * 1000) / 10 
      : 100;

    const consistency = calculateConsistency();

    const result: TestResult = {
      id: 'res-' + Date.now(),
      timestamp: Date.now(),
      wpm: netWpm,
      rawWpm: Math.max(netWpm, rawWpm),
      cpm,
      accuracy,
      consistency,
      timeElapsed: Math.round(duration),
      mode,
      modeDetail,
      totalKeystrokes: totalTyped,
      correctKeystrokes: correctTyped,
      incorrectKeystrokes: incorrectKeystrokesRef.current,
      extraKeystrokes: extraKeystrokesRef.current,
      missedKeystrokes: missedKeystrokesRef.current,
      wpmHistory: wpmHistoryRef.current,
      weakKeys: weakKeysRef.current
    };

    onFinishTest(result);
  }, [isFinished, mode, modeDetail, onFinishTest, calculateConsistency]);

  // Timer Tick (runs every 1 second when active)
  useEffect(() => {
    let interval: any = null;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const nextElapsed = prev + 1;
          const minutes = nextElapsed / 60;

          // Calculate current stats
          const currentTotal = totalKeystrokesRef.current;
          const currentCorrect = correctKeystrokesRef.current;
          const raw = Math.round((currentTotal / 5) / minutes) || 0;
          const net = Math.max(0, Math.round((currentCorrect / 5) / minutes)) || 0;
          const acc = currentTotal > 0 ? Math.round((currentCorrect / currentTotal) * 100) : 100;

          setLiveWpm(net);
          setLiveRawWpm(raw);
          setLiveAccuracy(acc);

          // Record snapshot in history graph
          wpmHistoryRef.current.push({
            second: nextElapsed,
            wpm: net,
            rawWpm: raw,
            errors: incorrectKeystrokesRef.current
          });

          return nextElapsed;
        });

        if (mode === 'time') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              completeTest();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, mode, completeTest]);

  // Handle Keystrokes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check Caps Lock status
    setCapsLockActive(e.getModifierState('CapsLock'));

    // Check Tab + Enter or Esc
    if (e.key === 'Tab') {
      e.preventDefault();
      onRestartTest();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onRestartTest();
      return;
    }

    if (isFinished) return;

    // Start timer on first genuine typing key
    if (!isActive && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    const currentWord = words[currentWordIndex] || '';

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (settings.confidenceMode) {
        // In confidence mode, backspaces are prohibited!
        e.preventDefault();
        soundSynthesizer.playKeySound(settings.soundProfile, 'Backspace', true);
        return;
      }

      if (e.ctrlKey) {
        // Ctrl + Backspace: clear current word input
        e.preventDefault();
        setCurrentInput('');
        soundSynthesizer.playKeySound(settings.soundProfile, 'Backspace');
        return;
      }

      if (currentInput.length > 0) {
        // regular backspace inside active word
        soundSynthesizer.playKeySound(settings.soundProfile, 'Backspace');
      } else if (currentWordIndex > 0) {
        // optional: jump back to previous word if wanted
        e.preventDefault();
        const prevIndex = currentWordIndex - 1;
        const prevTyped = typedHistory[prevIndex] || '';
        setCurrentWordIndex(prevIndex);
        setCurrentInput(prevTyped);
        setTypedHistory(prev => prev.slice(0, -1));
        soundSynthesizer.playKeySound(settings.soundProfile, 'Backspace');
      }
      return;
    }

    // Handle Spacebar (word commit)
    if (e.key === ' ') {
      e.preventDefault();
      if (currentInput.trim().length === 0) return;

      // Check current word correctness
      const isWordCorrect = currentInput === currentWord;
      const expectedChars = currentWord.length;
      const typedChars = currentInput.length;

      totalKeystrokesRef.current += 1; // space counts as keystroke
      keystrokeTimestampsRef.current.push(Date.now());

      if (isWordCorrect) {
        correctKeystrokesRef.current += 1;
        soundSynthesizer.playKeySound(settings.soundProfile, ' ');
      } else {
        incorrectKeystrokesRef.current += 1;
        soundSynthesizer.playKeySound(settings.soundProfile, ' ', true);
        if (typedChars < expectedChars) {
          missedKeystrokesRef.current += (expectedChars - typedChars);
        }
      }

      // Commit word
      setTypedHistory(prev => [...prev, currentInput]);
      setCurrentInput('');

      // Check if finished by words or quotes
      const nextWordIndex = currentWordIndex + 1;
      if (nextWordIndex >= words.length) {
        completeTest();
      } else {
        setCurrentWordIndex(nextWordIndex);
      }
      return;
    }

    // Normal Character Typed
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      totalKeystrokesRef.current += 1;
      keystrokeTimestampsRef.current.push(Date.now());

      const nextInput = currentInput + e.key;
      const charIndex = currentInput.length;
      const expectedChar = currentWord[charIndex];
      const isCharCorrect = e.key === expectedChar;

      if (isCharCorrect) {
        correctKeystrokesRef.current += 1;
        soundSynthesizer.playKeySound(settings.soundProfile, e.key);
      } else {
        incorrectKeystrokesRef.current += 1;
        soundSynthesizer.playKeySound(settings.soundProfile, e.key, true);

        // Record weak key
        const lowerKey = e.key.toLowerCase();
        weakKeysRef.current[lowerKey] = (weakKeysRef.current[lowerKey] || 0) + 1;

        if (charIndex >= currentWord.length) {
          extraKeystrokesRef.current += 1;
        }
      }

      // If user reaches end of last word in non-time mode
      if (currentWordIndex === words.length - 1 && nextInput === currentWord) {
        setCurrentInput(nextInput);
        completeTest();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Controlled input value
    const val = e.target.value;
    if (!val.endsWith(' ')) {
      setCurrentInput(val);
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="w-full max-w-4xl mx-auto my-6 flex flex-col items-center select-none cursor-text relative"
    >
      {/* Hidden real input for accessibility & precise mobile/desktop keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute -top-40 pointer-events-none"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Floating Status Bar (Timer / Word Counter & Real-Time Stats) */}
      <div className="w-full flex items-center justify-between px-2 mb-4 text-sm font-mono">
        {/* Left: Time or Word Counter */}
        <div className="flex items-center gap-3">
          {mode === 'time' && (
            <div 
              className="flex items-center gap-2 text-2xl font-bold tracking-wider"
              style={{ color: timeLeft <= 5 && isActive ? '#ef4444' : theme.primary }}
            >
              <Clock className="w-5 h-5 animate-pulse" />
              <span>{timeLeft}s</span>
            </div>
          )}

          {mode === 'words' && (
            <div className="flex items-center gap-2 text-xl font-bold" style={{ color: theme.primary }}>
              <Target className="w-5 h-5" />
              <span>{currentWordIndex} / {words.length}</span>
            </div>
          )}

          {(mode === 'quote' || mode === 'code' || mode === 'zen' || mode === 'custom') && (
            <div className="flex items-center gap-2 text-lg font-bold text-slate-400">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Word {currentWordIndex + 1} of {words.length}</span>
            </div>
          )}

          {quoteAuthor && (
            <span className="text-xs text-slate-400 italic hidden sm:inline">
              — {quoteAuthor}
            </span>
          )}

          {codeLanguage && (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono hidden sm:inline">
              {codeLanguage.toUpperCase()}
            </span>
          )}
        </div>

        {/* Right: Live WPM & Accuracy */}
        {settings.showLiveWpm && isActive && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Live:</span>
              <span className="text-white font-bold">{liveWpm}</span>
              <span className="text-slate-500">WPM</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Acc:</span>
              <span className="text-emerald-400 font-bold">{liveAccuracy}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Caps Lock Alert Banner */}
      {capsLockActive && (
        <div className="w-full flex items-center justify-center gap-2 py-1.5 px-4 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Caps Lock is ON!</span>
        </div>
      )}

      {/* Main Words Flow Surface */}
      <div 
        ref={wordsContainerRef}
        className="w-full min-h-[160px] max-h-[220px] overflow-hidden relative rounded-2xl p-6 glass-panel transition-all"
        style={{
          fontFamily: settings.fontFamily,
          lineHeight: '2.1rem',
          fontSize: '1.45rem',
          borderColor: theme.surfaceBorder
        }}
      >
        <div className="flex flex-wrap gap-x-[0.65em] gap-y-2 items-center">
          {words.map((word, wIdx) => {
            const isCompleted = wIdx < currentWordIndex;
            const isCurrent = wIdx === currentWordIndex;
            const typedWord = isCompleted ? typedHistory[wIdx] || '' : isCurrent ? currentInput : '';

            return (
              <span
                key={wIdx}
                ref={isCurrent ? activeWordRef : null}
                className={`relative inline-block transition-colors ${
                  isCurrent ? 'font-medium' : ''
                }`}
              >
                {/* Render expected word letters */}
                {word.split('').map((char, cIdx) => {
                  let charClass = 'text-slate-500'; // untyped default
                  let isCharActive = false;

                  if (isCompleted) {
                    const typedChar = typedWord[cIdx];
                    if (typedChar === char) {
                      charClass = 'text-slate-200';
                    } else {
                      charClass = 'text-red-400 underline decoration-red-500 decoration-2';
                    }
                  } else if (isCurrent) {
                    if (cIdx < currentInput.length) {
                      const typedChar = currentInput[cIdx];
                      if (typedChar === char) {
                        charClass = 'text-slate-100 font-semibold';
                      } else {
                        charClass = 'text-red-400 bg-red-500/20 rounded-sm';
                      }
                    } else if (cIdx === currentInput.length) {
                      isCharActive = true;
                    }
                  }

                  return (
                    <span key={cIdx} className={`relative typing-letter ${charClass}`}>
                      {/* Caret rendering if this is the active character */}
                      {isCurrent && isCharActive && (
                        <span 
                          className={`absolute left-0 -top-1 bottom-0 transition-all ${
                            settings.caretStyle === 'block'
                              ? 'w-full bg-indigo-500/40'
                              : settings.caretStyle === 'underline'
                              ? 'bottom-0 left-0 right-0 h-0.5 bg-indigo-400'
                              : 'w-[2.5px] bg-indigo-400 rounded-full caret-pulse'
                          }`}
                          style={{
                            backgroundColor: theme.caretColor,
                            boxShadow: `0 0 10px ${theme.primaryGlow}`
                          }}
                        />
                      )}
                      {char}
                    </span>
                  );
                })}

                {/* Render Extra characters typed beyond original word */}
                {isCurrent && currentInput.length > word.length && (
                  <>
                    {currentInput.slice(word.length).split('').map((extraChar, eIdx) => (
                      <span
                        key={'extra-' + eIdx}
                        className="text-red-300 bg-red-900/40 underline decoration-red-500 rounded-sm"
                      >
                        {extraChar}
                      </span>
                    ))}
                    {/* Caret after extras */}
                    <span 
                      className="inline-block w-[2.5px] h-6 bg-indigo-400 rounded-full caret-pulse ml-0.5 align-middle"
                      style={{ backgroundColor: theme.caretColor }}
                    />
                  </>
                )}

                {/* Caret if active word has typed whole word but waiting for spacebar */}
                {isCurrent && currentInput.length === word.length && (
                  <span 
                    className="inline-block w-[2.5px] h-6 bg-indigo-400 rounded-full caret-pulse ml-0.5 align-middle"
                    style={{ backgroundColor: theme.caretColor }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom Tooltip & Quick Action Toolbar */}
      <div className="w-full flex items-center justify-between mt-4 px-2 text-xs text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <button
            onClick={onRestartTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 hover:border-slate-600 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Restart Test</span>
          </button>

          <span className="hidden sm:inline text-slate-400">
            or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px] text-slate-300">Tab</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px] text-slate-300">Enter</kbd>
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden md:inline">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px] text-slate-300">Esc</kbd> to reset
          </span>
          <span className="text-slate-400">•</span>
          <span>Click anywhere to focus</span>
        </div>
      </div>
    </div>
  );
};
