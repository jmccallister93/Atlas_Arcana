export interface GameSessionInfo {
  sessionId: string;
  setupPhase: boolean;
  currentPhase: string;
  currentPlayerTurn: string;
  turnOrder: string[];
  tileGrid: [];
  turnsCompleted: number;
  titans: TitanInfo[];
  equipmentCardCount: [];
  questCardCount: [];
  treasureCardCount: [];
  worldEventCardCount: [];
  players: PlayerInfo[];
  playerPositions: PlayerPosition[]
  strongholdPositions: StrongholdPosition[]
  titanPositions: TitanPosition[]
  buildingPositions: BuildingPosition[]
}

export interface TitanInfo {
  titanName: string;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  stamina: number;
}

export interface LocationState {
  gameSessionInfo: GameSessionInfo;
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
  reaction: boolean;
}

export interface QuestItem {
  questName: string;
  description: string;
}

export interface BuildingInfo {
  type: string; 
  count: number; 
  location: {
    row: number;
    col: number;
  }[];
}

export interface PlayerInfo {
  socketId: string;
  username: string;
  victoryPoints: number;
  rank: number;
  totalHealth: number;
  currentHealth: number;
  offense: number;
  defense: number;
  stamina: number;
  movement: number;
  build: number;
  strongHoldPlaced: boolean;
 
  equippedItems: {
    weapon: any[];
    armor: any[];
    amulet: any[];
    boots: any[];
    gloves: any[];
  };
  buildings: {
    defense: BuildingInfo[];
    equipment: BuildingInfo[];
    quest: BuildingInfo[];
    resource: BuildingInfo[];
    movement: BuildingInfo[];
  };
  inventory: {
    resources: any;
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    quests: QuestItem[];
  };
}

export interface GameBoard {
  playerPositions: [{}]
  titanPositions: TitanPosition[]
  buildingPositions:[{}]
  strongholdPositions: [{}]
  tileGrid: TileGrid
}

export interface PlayerPosition {
  playerUsername: string;
  x: number;
  y: number;
}
export interface TitanPosition {
  titanName: string;
  x: number;
  y: number;
}
export interface BuildingPosition {
  playerUsername: string;
  buildingName: string;
  x: number;
  y: number;
}
export interface StrongholdPosition {
  playerUsername: string;
  x: number;
  y: number;
}

export interface TileGrid {
  tileGrid: string[][];
}