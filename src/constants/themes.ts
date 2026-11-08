import { ThemeColors } from '../types';

export const THEMES: ThemeColors[] = [
  {
    id: 'engineer-obsidian',
    name: 'Engineer Obsidian',
    background: '#07090e',
    surface: '#0d111a',
    surfaceBorder: '#1c2436',
    primary: '#0ea5e9', // Cyber sky blue
    primaryGlow: 'rgba(14, 165, 233, 0.28)',
    textMain: '#f1f5f9',
    textMuted: '#64748b',
    textCorrect: '#38bdf8',
    textIncorrect: '#ef4444',
    caretColor: '#38bdf8',
    tag: 'IDE Pro'
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    background: '#181825',
    surface: '#1e1e2e',
    surfaceBorder: '#313244',
    primary: '#89b4fa', // Sapphire
    primaryGlow: 'rgba(137, 180, 250, 0.25)',
    textMain: '#cdd6f4',
    textMuted: '#6c7086',
    textCorrect: '#a6e3a1',
    textIncorrect: '#f38ba8',
    caretColor: '#f5c2e7',
    tag: 'Developer'
  },
  {
    id: 'jetbrains-darcula',
    name: 'JetBrains Darcula',
    background: '#1e1f22',
    surface: '#2b2d30',
    surfaceBorder: '#393b40',
    primary: '#3574f0', // JetBrains blue
    primaryGlow: 'rgba(53, 116, 240, 0.3)',
    textMain: '#bcbec4',
    textMuted: '#6f737a',
    textCorrect: '#57b8ff',
    textIncorrect: '#fa6675',
    caretColor: '#3574f0',
    tag: 'IntelliJ'
  },
  {
    id: 'github-dark-pro',
    name: 'GitHub Dark Pro',
    background: '#0d1117',
    surface: '#161b22',
    surfaceBorder: '#30363d',
    primary: '#2f81f7', // GitHub link blue
    primaryGlow: 'rgba(47, 129, 247, 0.25)',
    textMain: '#f0f6fc',
    textMuted: '#8b949e',
    textCorrect: '#7ee787',
    textIncorrect: '#f85149',
    caretColor: '#2f81f7',
    tag: 'GitHub'
  },
  {
    id: 'terminal-matrix',
    name: 'Terminal Matrix',
    background: '#060a07',
    surface: '#0d140e',
    surfaceBorder: '#162b1b',
    primary: '#10b981', // Emerald terminal glow
    primaryGlow: 'rgba(16, 185, 129, 0.3)',
    textMain: '#ecfdf5',
    textMuted: '#4d7c66',
    textCorrect: '#34d399',
    textIncorrect: '#f87171',
    caretColor: '#10b981',
    tag: 'Matrix'
  },
  {
    id: 'linear-stealth',
    name: 'Linear Stealth',
    background: '#090a0f',
    surface: '#12141c',
    surfaceBorder: '#232634',
    primary: '#6366f1', // Indigo glow
    primaryGlow: 'rgba(99, 102, 241, 0.25)',
    textMain: '#f8fafc',
    textMuted: '#64748b',
    textCorrect: '#818cf8',
    textIncorrect: '#ef4444',
    caretColor: '#a5b4fc',
    tag: 'Modern'
  }
];

export const DEFAULT_THEME = THEMES[0];
