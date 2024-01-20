import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import {
  BuildingPosition,
  GameSessionInfo,
  PlayerInfo,
  PlayerPosition,
  StrongholdPosition,
  TitanPosition,
} from "../../components/GameComponents/Interfaces";
import socket, {
  onGameStateUpdate,
  offGameStateUpdate,
} from "../SocketClient/socketClient";

// Define the shape of your context
interface GameState {
  gameState: GameSessionInfo;
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
  updatePlayerPosition: (updatedPlayerPosition: PlayerPosition) => void;
  updateStrongholdPosition: (
    updatedStrongholdPosition: StrongholdPosition
  ) => void;
  updateTitanPosition: (updatedTitanPosition: TitanPosition) => void;
  updateBuildingPosition: (updatedBuildingPosition: BuildingPosition) => void;
}

// Create the context
const GameContext = createContext<GameState | undefined>(undefined);

type Selector<T> = (state: GameSessionInfo) => T;

export const useGameStatePart = <T extends unknown>(
  selector: Selector<T>
): T => {
  const { gameState } = useGameContext();

  // The useMemo hook will only recompute the selected state if gameState changes
  const selectedState = useMemo(() => selector(gameState), [gameState]);

  return selectedState;
};

// Helper hook to use the context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

const gameReducer = (state: GameSessionInfo, action: any) => {
  const newState = (() => {
    switch (action.type) {
      case "INITIAL_GAME_STATE":
        return { ...state, ...action.payload };
      case "UPDATE_GAME_STATE":
        return { ...state, ...action.payload };
      case "UPDATE_PLAYER_DATA":
        const updatedPlayers = state.players.map((player) =>
          player.username === action.payload.username ? action.payload : player
        );
        return { ...state, players: updatedPlayers };
      case "SET_CURRENT_PLAYER_TURN":
        return {
          ...state,
          gameState: { ...state, currentPlayerTurn: action.payload },
        };
        case "UPDATE_PLAYER_POSITION":
          const updatedPlayerPosisitions = state.playerPositions.map((position) =>
            position.playerUsername === action.payload.playerUsername
              ? action.payload
              : position
          );
          return { ...state, playerPositions: updatedPlayerPosisitions };
        case "UPDATE_STRONGHOLD_POSITION":
          return { ...state, ...action.payload };
    
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
  })();
  return newState;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, {});
  // initial state
  useEffect(() => {
    const handleInitialGameState = (newSession: GameSessionInfo) => {
      dispatch({ type: "INITIAL_GAME_STATE", payload: newSession });
    };

    // Subscribe to game initial state
    socket.on("matchFound", handleInitialGameState);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("matchFound", handleInitialGameState);
    };
  }, []);

  useEffect(() => {
    // Handler for game state updates
    const handleGameStateUpdate = (updatedState: GameSessionInfo) => {
      dispatch({ type: "UPDATE_GAME_STATE", payload: updatedState });
    };
    // Subscribe to game state updates from the server
    socket.on("updateGameState", handleGameStateUpdate);
    return () => {
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, []);

  const emitGameStateUpdate = (updatedData: Partial<GameSessionInfo>) => {
    console.log("From emitGameState update updatedData:",updatedData)
    if (gameState) {
      const updatedState = {
        sessionId: gameState.sessionId,
        newState: {
          ...gameState,
          ...updatedData,
        },
      };
      socket.emit("updateGameState", updatedState);
    }
  };
  // Function to update player data
  const updatePlayerData = (updatedPlayer: PlayerInfo) => {
    dispatch({ type: "UPDATE_PLAYER_DATA", payload: updatedPlayer });

    // Emit updated player data with correct typing
    if (gameState && gameState.players) {
      emitGameStateUpdate({
        players: gameState.players.map((player: PlayerInfo) =>
          player.username === updatedPlayer.username ? updatedPlayer : player
        ),
      });
    }
  };

  //   Player Position
  useEffect(() => {
    // Handler for game state updates
    const handlePlayerPositionUpdate = (updatedState: PlayerPosition) => {
      dispatch({ type: "UPDATE_PLAYER_POSITION", payload: updatedState });
    };
    // Subscribe to game state updates from the server
    socket.on("updatePlayerPosition", handlePlayerPositionUpdate);
    return () => {
      socket.off("updatePlayerPosition", handlePlayerPositionUpdate);
    };
  }, []);

  const emitPlayerPositionUpdate = (updatedData: Partial<GameSessionInfo>) => {
    console.log("From emitGameState update updatedData:", updatedData);
    if (gameState) {
      const updatedState = {
        sessionId: gameState.sessionId,
        newState: {
          ...gameState,
          ...updatedData,
        },
      };
      socket.emit("updatePlayerPosition", updatedState);
    }
  };

  const updatePlayerPosition = (updatedPlayerPosition: PlayerPosition) => {
    dispatch({
      type: "UPDATE_PLAYER_POSITION",
      payload: updatedPlayerPosition,
    });
    if (gameState && gameState.playerPositions) {
      emitPlayerPositionUpdate({
        playerPositions: gameState.playerPositions.map(
          (position: PlayerPosition) =>
            position.playerUsername === updatedPlayerPosition.playerUsername
              ? updatedPlayerPosition
              : position
        ),
      });
    }
  };

  //   Stronghold psoition
  useEffect(() => {
    // Handler for game state updates
    const handleStrongholdPositionUpdate = (
      updatedState: StrongholdPosition
    ) => {
      dispatch({ type: "UPDATE_STRONGHOLD_POSITION", payload: updatedState });
    };
    // Subscribe to game state updates from the server
    socket.on("updateStrongholdPosition", handleStrongholdPositionUpdate);
    return () => {
      socket.off("updateStrongholdPosition", handleStrongholdPositionUpdate);
    };
  }, []);

  const emitStrongholdPositionUpdate = (strongholdPosition: StrongholdPosition) => {
    if (gameState) {
        const updatePayload = {
            sessionId: gameState.sessionId,
            newStrongholdPosition: strongholdPosition,
        };
        socket.emit("updateStrongholdPosition", updatePayload);
    }
};



const updateStrongholdPosition = (updatedStrongholdPosition: StrongholdPosition) => {
  console.log(
    "Dispatching Stronghold Position Update:",
    updatedStrongholdPosition
  );
  dispatch({
    type: "UPDATE_STRONGHOLD_POSITION",
    payload: updatedStrongholdPosition,
  });

  // Directly emit the updated stronghold position to the backend
  console.log("Emitting Stronghold Position Update:", updatedStrongholdPosition);
  emitStrongholdPositionUpdate(updatedStrongholdPosition);
};


  //   Titan position
  useEffect(() => {
    // Handler for game state updates
    const handleTitanPositionUpdate = (updatedState: TitanPosition) => {
      dispatch({ type: "UPDATE_TITAN_POSITION", payload: updatedState });
    };
    // Subscribe to game state updates from the server
    socket.on("updateTitanPosition", handleTitanPositionUpdate);
    return () => {
      socket.off("updateTitanPosition", handleTitanPositionUpdate);
    };
  }, []);

  const emitTitanPositionUpdate = (updatedData: Partial<GameSessionInfo>) => {
    console.log("From emitGameState update updatedData:", updatedData);
    if (gameState) {
      const updatedState = {
        sessionId: gameState.sessionId,
        newState: {
          ...gameState,
          ...updatedData,
        },
      };
      socket.emit("updateTitanPosition", updatedState);
    }
  };

  const updateTitanPosition = (updatedTitanPosition: TitanPosition) => {
    dispatch({ type: "UPDATE_TITAN_POSITION", payload: updatedTitanPosition });
    if (gameState && gameState.titanPositions) {
      emitTitanPositionUpdate({
        titanPositions: gameState.titanPositions.map(
          (position: TitanPosition) =>
            position.titanName === updatedTitanPosition.titanName
              ? updatedTitanPosition
              : position
        ),
      });
    }
  };

  //   Building position
  useEffect(() => {
    // Handler for game state updates
    const handleBuildingPositionUpdate = (updatedState: BuildingPosition) => {
      dispatch({ type: "UPDATE_BUILDING_POSITION", payload: updatedState });
    };
    // Subscribe to game state updates from the server
    socket.on("updateBuildingPosition", handleBuildingPositionUpdate);
    return () => {
      socket.off("updateBuildingPosition", handleBuildingPositionUpdate);
    };
  }, []);

  const emitBuildingPositionUpdate = (
    updatedData: Partial<GameSessionInfo>
  ) => {
    console.log("From emitGameState update updatedData:", updatedData);
    if (gameState) {
      const updatedState = {
        sessionId: gameState.sessionId,
        newState: {
          ...gameState,
          ...updatedData,
        },
      };
      socket.emit("updateBuildingPosition", updatedState);
    }
  };
  const updateBuildingPosition = (
    updatedBuildingPosition: BuildingPosition
  ) => {
    dispatch({
      type: "UPDATE_BUILDING_POSITION",
      payload: updatedBuildingPosition,
    });
    if (gameState && gameState.buildingPositions) {
      emitBuildingPositionUpdate({
        buildingPositions: gameState.buildingPositions.map(
          (position: BuildingPosition) =>
            position.ownerName === updatedBuildingPosition.ownerName
              ? updatedBuildingPosition
              : position
        ),
      });
    }
  };


  useEffect(() => {
    console.log("From Gamecontext gameState:", gameState);
  }, [gameState]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        emitGameStateUpdate,
        updatePlayerData,
        updateBuildingPosition,
        updatePlayerPosition,
        updateTitanPosition,
        updateStrongholdPosition
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
