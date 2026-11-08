export interface CreateScoreDto {
  username: string;
  avatar?: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  mode: string;
  modeDetail: string;
}

export function validateCreateScoreDto(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body must be an object'] };
  }
  const body = data as Record<string, unknown>;

  if (typeof body.username !== 'string' || body.username.trim().length === 0) {
    errors.push('Username is required and must be a non-empty string');
  }
  if (typeof body.wpm !== 'number' || body.wpm < 0 || body.wpm > 350) {
    errors.push('WPM must be a valid number between 0 and 350');
  }
  if (typeof body.accuracy !== 'number' || body.accuracy < 0 || body.accuracy > 100) {
    errors.push('Accuracy must be a percentage between 0 and 100');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
