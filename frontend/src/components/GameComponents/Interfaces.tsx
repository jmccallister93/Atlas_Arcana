
export interface GameSessionInfo {
    sessionId: string;
    gameState: {  turnOrder: string[] };
    players: PlayerInfo[];
  }

export interface LocationState {
  sessionId?: string;
  gameSessionInfo?: GameSessionInfo;
}

export interface PlayerInfo {
  username: string;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  stamina: number;
  movement: number;
  build: number;
  inventory: {
    resources: any[]; // Update the type based on your actual data structure
    equipment: any[]; // Same as above
    treasures: any[]; // Same as above
    quests: any[]; // Same as above
  };
}


export interface GameState {
  totalTurns: number;
  playerTurn: string;
  gamePhase: string;
  playerPool: Array<string>;
  timer: string;
}
