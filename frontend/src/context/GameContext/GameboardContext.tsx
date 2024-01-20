import React, { createContext, useContext, useReducer } from "react";
import {
    BuildingPosition,
    GameSessionInfo,
    PlayerInfo,
    PlayerPosition,
    StrongholdPosition,
    TitanPosition,
  } from "../../components/GameComponents/Interfaces";
import socket from "../SocketClient/socketClient";

interface GameboardState {
  updatePlayerPosition: (updatedPlayerPosition: PlayerPosition) => void;
  updateStrongholdPosition: (updatedStrongholdPosition: StrongholdPosition) => void;
  updateTitanPosition: (updatedTitanPosition: TitanPosition) => void;
  updateBuildingPosition: (updatedBuildingPosition: BuildingPosition) => void;
}

const GameboardContext = createContext<GameboardState | undefined>(undefined);

// Helper hook to use the context
export const useGameboardContext = () => {
  const context = useContext(GameboardContext);
  if (!context) {
    throw new Error("useGameboardContext must be used within a GameboardProvider");
  }
  return context;
};

const gameboardReducer = (state: GameSessionInfo, action: any) => {
  switch (action.type) {
    case "UPDATE_PLAYER_POSITION":
        const updatedPlayerPosisitions = state.playerPositions.map((position) =>
          position.playerUsername === action.payload.playerUsername
            ? action.payload
            : position
        );
        return { ...state, playerPositions: updatedPlayerPosisitions };
      case "UPDATE_STRONGHOLD_POSITION":
        let updatedStrongholdPositions = [...state.strongholdPositions];

        const existingIndex = updatedStrongholdPositions.findIndex(
          (pos) => pos.playerUsername === action.payload.playerUsername
        );

        if (existingIndex >= 0) {
          // Update existing position
          updatedStrongholdPositions[existingIndex] = action.payload;
        } else {
          // Add new position
          updatedStrongholdPositions.push(action.payload);
        }

        const newState = {
          ...state,
          strongholdPositions: updatedStrongholdPositions,
        };

        return newState;

      case "UPDATE_TITAN_POSITION":
        const updatedTtianPosisitions = state.titanPositions.map((position) =>
          position.titanName === action.payload.titanName
            ? action.payload
            : position
        );
        return { ...state, titanPositions: updatedTtianPosisitions };
      case "UPDATE_BUILDING_POSITION":
        const updatedBuildingPosisitions = state.buildingPositions.map(
          (position) =>
            position.buildingName === action.payload.buildingName
              ? action.payload
              : position
        );
        return { ...state, buildingPositions: updatedBuildingPosisitions };
      default:
        return state;
  }
};

interface GameboardProviderProps {
  children: React.ReactNode;
}

export const GameboardProvider: React.FC<GameboardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameboardReducer, {});

  const updatePlayerPosition = (updatedPlayerPosition: PlayerPosition) => {
    dispatch({
      type: "UPDATE_PLAYER_POSITION",
      payload: updatedPlayerPosition,
    });
    if (gameState && gameState.playerPositions) {
      emitGameStateUpdate({
        playerPositions: gameState.playerPositions.map(
          (position: PlayerPosition) =>
            position.playerUsername === updatedPlayerPosition.playerUsername
              ? updatedPlayerPosition
              : position
        ),
      });
    }
  };

  const updateStrongholdPosition = (updatedStrongholdPosition: StrongholdPosition) => {
    console.log("Dispatching Stronghold Position Update:", updatedStrongholdPosition);
    dispatch({
      type: "UPDATE_STRONGHOLD_POSITION",
      payload: updatedStrongholdPosition,
    });
  // Check if the stronghold position already exists
  const positionExists = gameState.strongholdPositions.some((position: StrongholdPosition) => 
    position.playerUsername === updatedStrongholdPosition.playerUsername
  );

  let updatedPositions;
  
  if (positionExists) {
    // Update the existing position
    updatedPositions = gameState.strongholdPositions.map((position: StrongholdPosition) => 
      position.playerUsername === updatedStrongholdPosition.playerUsername
        ? updatedStrongholdPosition
        : position
    );
  } else {
    // Add the new position
    updatedPositions = [...gameState.strongholdPositions, updatedStrongholdPosition];
  }
      
    console.log("Emitting Updated Stronghold Positions:", updatedPositions);
    emitGameStateUpdate({ strongholdPositions: updatedPositions });
      
  };
  

  const updateTitanPosition = (updatedTitanPosition: TitanPosition) => {
    dispatch({ type: "UPDATE_TITAN_POSITION", payload: updatedTitanPosition });
    if (gameState && gameState.titanPositions) {
      emitGameStateUpdate({
        titanPositions: gameState.titanPositions.map(
          (position: TitanPosition) =>
            position.titanName === updatedTitanPosition.titanName
              ? updatedTitanPosition
              : position
        ),
      });
    }
  };

  const updateBuildingPosition = (
    updatedBuildingPosition: BuildingPosition
  ) => {
    dispatch({
      type: "UPDATE_BUUILDING_POSITION",
      payload: updatedBuildingPosition,
    });
    if (gameState && gameState.buildingPositions) {
      emitGameStateUpdate({
        buildingPositions: gameState.buildingPositions.map(
          (position: BuildingPosition) =>
            position.ownerName === updatedBuildingPosition.ownerName
              ? updatedBuildingPosition
              : position
        ),
      });
    }
  };

  return (
    <GameboardContext.Provider value={{
      updatePlayerPosition,
      updateStrongholdPosition,
      updateTitanPosition,
      updateBuildingPosition,
    }}>
      {children}
    </GameboardContext.Provider>
  );
};
