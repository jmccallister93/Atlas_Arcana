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
}

export interface TitanInfo {
  titanName: string;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  stamina: number;
  row: number;
  col: number;
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
}

export interface QuestItem {
  questName: string;
  description: string;
}

export interface BuildingInfo {
  type: string; // e.g., 'outpost', 'fortification', 'armory', etc.
  count: number; // The count of this type of building
  location: {
    row: number;
    col: number;
  }[];
}

export interface PlayerInfo {
  username: string;
  col: number;
  row: number;
  victoryPoints: number;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  stamina: number;
  movement: number;
  build: number;
  strongHoldPlaced: boolean;
  strongHold: {
    col: number;
    row: number;
  };
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
