export type TypingMode = 'time' | 'words' | 'quote' | 'code' | 'zen' | 'custom';

export type TimeLimit = 15 | 30 | 60 | 120 | number;
export type WordLimit = 10 | 25 | 50 | 100 | number;

export type SoundProfile = 'off' | 'cherry-blue' | 'cherry-brown' | 'typewriter' | 'pop';
export type CaretStyle = 'line' | 'block' | 'underline' | 'pulse';
export type FontFamily = 'JetBrains Mono' | 'Fira Code' | 'Roboto Mono' | 'Inter';

export interface ThemeColors {
  id: string;
  name: string;
  background: string;
  surface: string;
  surfaceBorder: string;
  primary: string;
  primaryGlow: string;
  textMain: string;
  textMuted: string;
  textCorrect: string;
  textIncorrect: string;
  caretColor: string;
  tag: string;
}

export interface KeystrokeEvent {
  key: string;
  timestamp: number;
  isCorrect: boolean;
  expected: string;
}

export interface WpmPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  consistency: number;
  timeElapsed: number; // in seconds
  mode: TypingMode;
  modeDetail: string; // e.g. "30s", "50 words", "JavaScript", "Albert Einstein"
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  extraKeystrokes: number;
  missedKeystrokes: number;
  wpmHistory: WpmPoint[];
  weakKeys: Record<string, number>; // key -> error count
  isNewPersonalBest?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  username: string;
  avatar: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  mode: TypingMode;
  modeDetail: string;
  timestamp: number;
  badge?: string;
  country?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  joinedAt: number;
  testsCompleted: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTimeTypedSeconds: number;
  history: TestResult[];
  favoriteMode: TypingMode;
}

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: 'philosophy' | 'tech' | 'science' | 'literature' | 'wisdom';
  length: 'short' | 'medium' | 'long';
}

export interface CodeSnippetItem {
  id: string;
  language: 'javascript' | 'typescript' | 'python' | 'rust' | 'html' | 'css';
  title: string;
  code: string;
}

export interface TypingSettings {
  soundProfile: SoundProfile;
  soundVolume: number; // 0 to 1
  caretStyle: CaretStyle;
  smoothCaret: boolean;
  fontFamily: FontFamily;
  themeId: string;
  blindMode: boolean;
  confidenceMode: boolean; // cannot backspace
  indicateCapslock: boolean;
  showLiveWpm: boolean;
  showLiveTimer: boolean;
  quickRestartKey: boolean; // Tab + Enter
}
