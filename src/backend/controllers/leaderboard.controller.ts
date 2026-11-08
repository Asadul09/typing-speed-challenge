import { nestLeaderboardService } from '../services/leaderboard.nest-service';
import { CreateScoreDto } from '../dto/create-score.dto';

/**
 * NestJS-patterned Leaderboard Controller
 * Handles HTTP requests, dispatching to services and returning standardized responses
 */
export class NestLeaderboardController {
  async getLeaderboard(query: { mode?: string; limit?: number }) {
    try {
      const data = await nestLeaderboardService.getTopLeaderboard(query.mode, query.limit || 20);
      return {
        statusCode: 200,
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        success: false,
        message: error.message || 'Internal server error'
      };
    }
  }

  async postScore(dto: CreateScoreDto) {
    try {
      const result = await nestLeaderboardService.recordScore(dto);
      return {
        statusCode: 201,
        success: true,
        data: result.entry,
        message: 'Score saved to leaderboard'
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        success: false,
        message: error.message || 'Validation error'
      };
    }
  }
}

export const nestLeaderboardController = new NestLeaderboardController();
