
export interface GameSessionInfo {
    sessionId: string;
    gameState: {  turnOrder: string[] };
    players: PlayerInfo[];
  }

export interface LocationState {
  sessionId?: string;
  gameSessionInfo?: GameSessionInfo;
}

export interface EquipmentItem {
    equipmentName: string;
    slot: string;
    set: string;
    element: string;
    bonus: string;
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
        portal:  any[],
        road:  any[],
        humanCatapult: any[],
      },
      equipmentCardCapacity: number,
      treasureCardCapacity: number,
  },
  inventory: {
    resources: any; 
    equipment:EquipmentItem[]
    treasures: any[]; 
    quests: any[]; 
  };
}


export interface GameState {
  totalTurns: number;
  playerTurn: string;
  gamePhase: string;
  playerPool: Array<string>;
  timer: string;
}
