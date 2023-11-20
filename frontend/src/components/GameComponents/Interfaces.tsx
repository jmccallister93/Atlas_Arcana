export interface LocationState {
  sessionId?: string;
  gameSessionInfo?: GameSessionInfo;
}

interface Inventory {
    resources: any[];  // Specify the type of resources if known
    equipment: any[];  // Specify the type of equipment if known
    treasures: any[];  // Specify the type of treasures if known
    quests: any[];     // Specify the type of quests if known
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
      quests: any[];    // Same as above
    };
  }
  

export interface GameSessionInfo {
    sessionId: string;
    gameState: { testState: boolean };
    players: PlayerInfo[];
  }

export interface GameState {
  totalTurns: number;
  playerTurn: string;
  gamePhase: string;
  playerPool: Array<string>;
  timer: string;
}
