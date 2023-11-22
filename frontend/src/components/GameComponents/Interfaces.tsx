
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
  victoryPoints: number;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  stamina: number;
  movement: number;
  build: number;
  equippedItems: {
    weapon: any[],
    armor: any[],
    amulet: any[],
    boots: any[],
    gloves: any[]
  }
  buildings: {
    defense: {
        outpost: any[],
        fortification: any[],
        archerTower: any[],
        battlement: any[]
      },
      equipment: {
        armory: any[],
        forge: any[],
        attunementShrine:any[],
        warehouse:any[],
      },
      quest: {
        tavern: any[],
        guildHall: any[],
        library: any[],
        oracleHut: any[],
      },
      resource: {
        farm: any[],
        ranch: any[],
        plantation: any[],
      },
      movement: {
        portal: 0,
        road: 0,
        humanCatapult:0,
      },
  },
  inventory: {
    resources: any; // Update the type based on your actual data structure
    equipment: {
        equipmentName: any[],
        slot: any[],
        set: any[],
        element: any[],
        bonus: any[],
    }; // Same as above
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
