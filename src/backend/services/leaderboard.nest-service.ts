import { LeaderboardEntry } from '../../types';
import { storageService } from '../../services/storage.service';
import { CreateScoreDto, validateCreateScoreDto } from '../dto/create-score.dto';

/**
 * NestJS-patterned Leaderboard Service
 * Encapsulates business logic, data persistence, and ranking computations
 */
export class NestLeaderboardService {
  async getTopLeaderboard(mode?: string, limit: number = 20): Promise<LeaderboardEntry[]> {
    let entries = storageService.getLeaderboard();
    if (mode && mode !== 'all') {
      entries = entries.filter(e => e.mode === mode);
    }
    return entries.slice(0, limit);
  }

  async recordScore(dto: CreateScoreDto): Promise<{ success: boolean; entry: LeaderboardEntry }> {
    const validation = validateCreateScoreDto(dto);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    let badge = '🌱 Apprentice';
    if (dto.wpm >= 140) badge = '👑 Mythic';
    else if (dto.wpm >= 120) badge = '⚡ Speed Demon';
    else if (dto.wpm >= 95) badge = '🚀 Pro Typist';
    else if (dto.wpm >= 70) badge = '✨ Fast';

    const entry: LeaderboardEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: dto.username.trim(),
      avatar: dto.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dto.username)}`,
      wpm: Math.round(dto.wpm),
      rawWpm: Math.round(dto.rawWpm),
      accuracy: Math.round(dto.accuracy * 10) / 10,
      consistency: Math.round(dto.consistency),
      mode: dto.mode as any,
      modeDetail: dto.modeDetail,
      timestamp: Date.now(),
      badge,
      country: 'YOU'
    };

    const current = storageService.getLeaderboard();
    const updated = [...current, entry].sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    const ranked = updated.slice(0, 100).map((item, idx) => ({ ...item, rank: idx + 1 }));
    storageService.saveLeaderboard(ranked);

    return { success: true, entry };
  }
}

export const nestLeaderboardService = new NestLeaderboardService();
