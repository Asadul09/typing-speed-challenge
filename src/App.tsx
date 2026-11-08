import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TypingArea } from './components/TypingArea';
import { ResultsModal } from './components/ResultsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { CustomTextModal } from './components/CustomTextModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { THEMES } from './constants/themes';
import { 
  TypingMode, 
  TimeLimit, 
  WordLimit, 
  TypingSettings, 
  UserProfile, 
  TestResult, 
  LeaderboardEntry 
} from './types';
import { storageService } from './services/storage.service';
import { textGenerator } from './services/textGenerator.service';
import { soundSynthesizer } from './services/soundSynthesizer.service';
import { nestLeaderboardController } from './backend/controllers/leaderboard.controller';
import { Server, Sparkles, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  // Persistence state
  const [settings, setSettings] = useState<TypingSettings>(() => storageService.getSettings());
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storageService.getLeaderboard());

  // Test Mode Configuration
  const [mode, setMode] = useState<TypingMode>('time');
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(30);
  const [wordLimit, setWordLimit] = useState<WordLimit>(25);
  const [quoteCategory, setQuoteCategory] = useState<string>('all');
  const [codeLanguage, setCodeLanguage] = useState<string>('all');
  const [customText, setCustomText] = useState<string>('');

  // Active Test States
  const [targetText, setTargetText] = useState<string>('');
  const [quoteAuthor, setQuoteAuthor] = useState<string | undefined>();
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isPB, setIsPB] = useState<boolean>(false);

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomTextOpen, setIsCustomTextOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Active theme object
  const currentTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];

  // Apply theme variables to DOM root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', currentTheme.background);
    root.style.setProperty('--surface-color', currentTheme.surface);
    root.style.setProperty('--border-color', currentTheme.surfaceBorder);
    root.style.setProperty('--primary-color', currentTheme.primary);
    root.style.setProperty('--primary-glow', currentTheme.primaryGlow);
    root.style.setProperty('--text-main', currentTheme.textMain);
    root.style.setProperty('--text-muted', currentTheme.textMuted);
    root.style.setProperty('--text-correct', currentTheme.textCorrect);
    root.style.setProperty('--text-incorrect', currentTheme.textIncorrect);
    root.style.setProperty('--caret-color', currentTheme.caretColor);

    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.textMain;
  }, [currentTheme]);

  // Sync sound volume to synthesizer
  useEffect(() => {
    soundSynthesizer.setVolume(settings.soundVolume);
  }, [settings.soundVolume]);

  // Compute textual detail label (e.g., "30s", "50 words", "JavaScript")
  const getModeDetail = useCallback(() => {
    switch (mode) {
      case 'time':
        return `${timeLimit}s`;
      case 'words':
        return `${wordLimit} words`;
      case 'quote':
        return quoteAuthor ? quoteAuthor : 'Quote';
      case 'code':
        return selectedLanguage ? selectedLanguage.toUpperCase() : 'Code';
      case 'zen':
        return 'Zen Flow';
      case 'custom':
        return 'Custom';
      default:
        return '';
    }
  }, [mode, timeLimit, wordLimit, quoteAuthor, selectedLanguage]);

  // Generate target text based on active mode
  const regenerateText = useCallback(() => {
    setTestResult(null);
    setIsPB(false);

    if (mode === 'time') {
      // Generate sufficient words for the time limit
      const count = Math.max(50, Math.ceil(timeLimit * 2.5));
      setTargetText(textGenerator.generateWords(count));
      setQuoteAuthor(undefined);
      setSelectedLanguage(undefined);
    } else if (mode === 'words') {
      setTargetText(textGenerator.generateWords(wordLimit));
      setQuoteAuthor(undefined);
      setSelectedLanguage(undefined);
    } else if (mode === 'quote') {
      const q = textGenerator.getRandomQuote(quoteCategory);
      setTargetText(q.text);
      setQuoteAuthor(q.author);
      setSelectedLanguage(undefined);
    } else if (mode === 'code') {
      const c = textGenerator.getRandomCodeSnippet(codeLanguage);
      setTargetText(c.code);
      setSelectedLanguage(c.language);
      setQuoteAuthor(undefined);
    } else if (mode === 'zen') {
      setTargetText(textGenerator.generateWords(120));
      setQuoteAuthor(undefined);
      setSelectedLanguage(undefined);
    } else if (mode === 'custom') {
      setTargetText(customText || textGenerator.generateWords(30));
      setQuoteAuthor(undefined);
      setSelectedLanguage(undefined);
    }
  }, [mode, timeLimit, wordLimit, quoteCategory, codeLanguage, customText]);

  // Trigger text generation when mode / filters change
  useEffect(() => {
    regenerateText();
  }, [regenerateText]);

  // Handle settings update
  const handleUpdateSettings = (newSettings: Partial<TypingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  // Handle profile update
  const handleUpdateProfile = (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  // Handle test completion
  const handleFinishTest = (result: TestResult) => {
    // Record into career profile
    const { profile: updatedProfile, isPB: newPB } = storageService.recordTestCompleted(result);
    setProfile({ ...updatedProfile });
    setIsPB(newPB);
    setTestResult(result);

    // If new PB or high score, prompt or auto-register into local leaderboard
    if (result.wpm >= 60) {
      storageService.addScoreToLeaderboard(result, profile.username, profile.avatar);
      setLeaderboard(storageService.getLeaderboard());
    }
  };

  // Save score to leaderboard manually from result modal
  const handleSaveToLeaderboard = async () => {
    if (!testResult) return;
    try {
      // Use NestJS-patterned controller
      await nestLeaderboardController.postScore({
        username: profile.username,
        avatar: profile.avatar,
        wpm: testResult.wpm,
        rawWpm: testResult.rawWpm,
        accuracy: testResult.accuracy,
        consistency: testResult.consistency,
        mode: testResult.mode,
        modeDetail: testResult.modeDetail
      });
      setLeaderboard(storageService.getLeaderboard());
    } catch (e) {
      console.error('Failed to post score via NestJS controller', e);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans"
      style={{ backgroundColor: currentTheme.background, color: currentTheme.textMain }}
    >
      {/* Top Header */}
      <Header
        profile={profile}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 flex flex-col justify-center items-center">
        {/* Mode & Category Bar (Hidden while looking at results modal) */}
        {!testResult && (
          <div className="w-full mb-2">
            <ModeSelector
              mode={mode}
              timeLimit={timeLimit}
              wordLimit={wordLimit}
              quoteCategory={quoteCategory}
              codeLanguage={codeLanguage}
              onSelectMode={setMode}
              onSelectTimeLimit={setTimeLimit}
              onSelectWordLimit={setWordLimit}
              onSelectQuoteCategory={setQuoteCategory}
              onSelectCodeLanguage={setCodeLanguage}
              onOpenCustomTextModal={() => setIsCustomTextOpen(true)}
              accentColor={currentTheme.primary}
            />
          </div>
        )}

        {/* Typing Area or Results View */}
        {testResult ? (
          <ResultsModal
            result={testResult}
            theme={currentTheme}
            isPersonalBest={isPB}
            onRestart={regenerateText}
            onSaveToLeaderboard={handleSaveToLeaderboard}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        ) : (
          <TypingArea
            targetText={targetText}
            mode={mode}
            modeDetail={getModeDetail()}
            timeLimit={typeof timeLimit === 'number' ? timeLimit : 30}
            settings={settings}
            theme={currentTheme}
            onFinishTest={handleFinishTest}
            onRestartTest={regenerateText}
            quoteAuthor={quoteAuthor}
            codeLanguage={selectedLanguage}
          />
        )}
      </main>

      {/* Bottom Footer Info */}
      <footer className="w-full max-w-6xl mx-auto py-5 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-slate-400">VelocityType Pro Engine</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            NestJS Architecture &amp; MERN Stack Active
          </span>
          <span className="text-slate-600">•</span>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300 font-semibold tracking-wide">
            Built by Asadut Jaman
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>Theme: {currentTheme.name}</span>
          <span>•</span>
          <span>Switch: {settings.soundProfile}</span>
          <span>•</span>
          <span>Font: {settings.fontFamily}</span>
        </div>
      </footer>

      {/* Dialog Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        currentUsername={profile.username}
        theme={currentTheme}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        theme={currentTheme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        theme={currentTheme}
      />

      <CustomTextModal
        isOpen={isCustomTextOpen}
        onClose={() => setIsCustomTextOpen(false)}
        onApplyCustomText={(txt) => {
          setCustomText(txt);
          setMode('custom');
          setTargetText(txt);
        }}
        theme={currentTheme}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={currentTheme}
      />
    </div>
  );
};

export default App;
