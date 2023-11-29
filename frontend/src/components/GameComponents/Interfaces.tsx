
export interface GameSessionInfo {
    sessionId: string;
    gameState: {  turnOrder: string[], gameBoardSeed: number, randomSequence: number[] };
    players: PlayerInfo[];
  }

export interface LocationState {
  sessionId?: string;
  gameSessionInfo?: GameSessionInfo;
}

export interface EquipmentItem {
    equipmentName: string;
    rank: number;
    slot: string;
    set: string;
    element: string;
    bonus: string;
  }

  export interface TreasureItem {
    treasureName: string;
    description: string;
  }

  export interface QuestItem {
    questName: string;
    description: string;
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
        outpost: number,
        fortification: number,
        archerTower: number,
        battlement: number
      },
      equipment: {
        armory: number,
        forge: number,
        attunementShrine:number,
        warehouse:number,
      },
      quest: {
        tavern: number,
        guildHall: number,
        library: number,
        oracleHut: number,
      },
      resource: {
        farm: number,
        ranch: number,
        plantation: number,
      },
      movement: {
        portal:  number,
        road:  number,
        humanCatapult: number,
      },
      equipmentCardCapacity: number,
      treasureCardCapacity: number,
  },
  inventory: {
    resources: any; 
    equipment:EquipmentItem[];
    treasures: TreasureItem[]; 
    quests: QuestItem[]; 
  };
}


export interface GameState {
  totalTurns: number;
  playerTurn: string;
  gamePhase: string;
  playerPool: Array<string>;
  timer: string;
}
