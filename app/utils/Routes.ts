export class Routes {
  static readonly HOME = '/';
  
  static readonly USERS = '/users';
  static readonly COUNTRIES = '/countries';
  static readonly COLLECTIONS = '/collections';
  
  private static getCardUrl(userId: string, cardType: 'experience' | 'challenge', cardId: string | null = ''): string {
    return `${Routes.USERS}/${userId}/cards/${cardType}/${cardId}`;
  }

  static getExperienceCardUrl(userId: string, cardId: string | null = ''): string {
    return Routes.getCardUrl(userId, 'experience', cardId);
  }

  static getChallengeCardUrl(userId: string, cardId: string | null = ''): string {
    return Routes.getCardUrl(userId, 'challenge', cardId);
  }
  
}
