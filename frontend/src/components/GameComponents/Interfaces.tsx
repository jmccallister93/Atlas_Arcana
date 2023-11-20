export interface LocationState {
  sessionId?: string;
  gameSessionInfo?: GameSessionInfo;
}

export interface PlayerInfo {
  id: string;
  name: string;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  // Add other player properties as needed
}

export interface GameSessionInfo {
  sessionId: string;
  gameState: { testState: boolean };
  players: string[];
}
