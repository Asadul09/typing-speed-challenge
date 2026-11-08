import { LeaderboardEntry, TestResult, TypingSettings, UserProfile } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'vt_settings_v1',
  PROFILE: 'vt_profile_v1',
  LEADERBOARD: 'vt_leaderboard_v1',
  HISTORY: 'vt_history_v1'
};

const DEFAULT_SETTINGS: TypingSettings = {
  soundProfile: 'cherry-blue',
  soundVolume: 0.65,
  caretStyle: 'line',
  smoothCaret: true,
  fontFamily: 'JetBrains Mono',
  themeId: 'engineer-obsidian',
  blindMode: false,
  confidenceMode: false,
  indicateCapslock: true,
  showLiveWpm: true,
  showLiveTimer: true,
  quickRestartKey: true
};

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    rank: 1,
    username: 'ApexTyper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    wpm: 154,
    rawWpm: 161,
    accuracy: 99.4,
    consistency: 94,
    mode: 'time',
    modeDetail: '60s',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    badge: '👑 Mythic',
    country: 'US'
  },
  {
    id: 'lead-2',
    rank: 2,
    username: 'NeuroKey',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    wpm: 142,
    rawWpm: 148,
    accuracy: 98.8,
    consistency: 91,
    mode: 'time',
    modeDetail: '30s',
    timestamp: Date.now() - 1000 * 60 * 60 * 28,
    badge: '⚡ Speed Demon',
    country: 'DE'
  },
  {
    id: 'lead-3',
    rank: 3,
    username: 'ChronoStroke',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    wpm: 136,
    rawWpm: 140,
    accuracy: 99.1,
    consistency: 89,
    mode: 'words',
    modeDetail: '50 words',
    timestamp: Date.now() - 1000 * 60 * 60 * 40,
    badge: '⚡ Speed Demon',
    country: 'JP'
  },
  {
    id: 'lead-4',
    rank: 4,
    username: 'QuantumKey',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces',
    wpm: 125,
    rawWpm: 130,
    accuracy: 97.9,
    consistency: 87,
    mode: 'time',
    modeDetail: '60s',
    timestamp: Date.now() - 1000 * 60 * 60 * 70,
    badge: '⚡ Speed Demon',
    country: 'CA'
  },
  {
    id: 'lead-5',
    rank: 5,
    username: 'CodeNinja_X',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
    wpm: 118,
    rawWpm: 124,
    accuracy: 98.2,
    consistency: 85,
    mode: 'code',
    modeDetail: 'JavaScript',
    timestamp: Date.now() - 1000 * 60 * 60 * 95,
    badge: '🚀 Pro Typist',
    country: 'GB'
  },
  {
    id: 'lead-6',
    rank: 6,
    username: 'Velocita',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
    wpm: 112,
    rawWpm: 116,
    accuracy: 96.5,
    consistency: 82,
    mode: 'quote',
    modeDetail: 'Steve Jobs',
    timestamp: Date.now() - 1000 * 60 * 60 * 110,
    badge: '🚀 Pro Typist',
    country: 'AU'
  }
];

class StorageService {
  public getSettings(): TypingSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: TypingSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  public getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load profile', e);
    }

    const defaultProfile: UserProfile = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      username: 'KeyboardNinja',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ninja',
      bio: 'Typing enthusiast sharpening every keystroke.',
      joinedAt: Date.now(),
      testsCompleted: 0,
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalTimeTypedSeconds: 0,
      history: [],
      favoriteMode: 'time'
    };

    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  public saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }

  public getLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load leaderboard', e);
    }
    // seed initial
    this.saveLeaderboard(INITIAL_LEADERBOARD);
    return INITIAL_LEADERBOARD;
  }

  public saveLeaderboard(entries: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save leaderboard', e);
    }
  }

  public addScoreToLeaderboard(result: TestResult, username: string, avatar: string): LeaderboardEntry[] {
    const list = this.getLeaderboard();

    // Assign badge based on wpm
    let badge = '🌱 Apprentice';
    if (result.wpm >= 140) badge = '👑 Mythic';
    else if (result.wpm >= 120) badge = '⚡ Speed Demon';
    else if (result.wpm >= 95) badge = '🚀 Pro Typist';
    else if (result.wpm >= 70) badge = '✨ Fast';

    const newEntry: LeaderboardEntry = {
      id: 'entry-' + Date.now(),
      username,
      avatar,
      wpm: result.wpm,
      rawWpm: result.rawWpm,
      accuracy: result.accuracy,
      consistency: result.consistency,
      mode: result.mode,
      modeDetail: result.modeDetail,
      timestamp: Date.now(),
      badge,
      country: 'YOU'
    };

    list.push(newEntry);
    // Sort descending by WPM then accuracy
    list.sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      return b.accuracy - a.accuracy;
    });

    // Re-rank
    const ranked = list.slice(0, 50).map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    this.saveLeaderboard(ranked);
    return ranked;
  }

  public recordTestCompleted(result: TestResult): { profile: UserProfile; isPB: boolean } {
    const profile = this.getProfile();
    const isPB = result.wpm > profile.bestWpm;

    if (isPB) {
      profile.bestWpm = result.wpm;
    }

    profile.testsCompleted += 1;
    profile.totalTimeTypedSeconds += result.timeElapsed;

    // Recalculate average WPM & Accuracy
    const prevCount = profile.testsCompleted - 1;
    profile.averageWpm = Math.round(
      (profile.averageWpm * prevCount + result.wpm) / profile.testsCompleted
    );
    profile.averageAccuracy = Math.round(
      ((profile.averageAccuracy * prevCount + result.accuracy) / profile.testsCompleted) * 10
    ) / 10;

    // Add to history (keep last 50)
    profile.history = [result, ...(profile.history || [])].slice(0, 50);

    this.saveProfile(profile);

    return { profile, isPB };
  }
}

export const storageService = new StorageService();
