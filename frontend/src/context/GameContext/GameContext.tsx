import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BuildingPosition,
  GameBoard,
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

interface GameBoardState {
  playerPositions: PlayerPosition[];
  titanPositions: TitanPosition[];
  // strongholdPositions: StrongholdPosition[];
}

const GameBoardContext = createContext<
  | {
      gameBoard: GameBoardState;
      updateGameBoard: (partialState: Partial<GameBoardState>) => void;
    }
  | undefined
>(undefined);

export const useGameBoardContext = () => {
  const context = useContext(GameBoardContext);
  if (!context) {
    throw new Error(
      "useGameBoardContext must be used within a GameBoardProvider"
    );
  }
  return context;
};

const gameBoardReducer = (
  state: GameBoardState,
  action: any
): GameBoardState => {
  switch (action.type) {
    case "UPDATE_GAME_BOARD":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialGameBoardState: GameBoardState = {
  playerPositions: [], // Assuming this is an array of PlayerPosition
  titanPositions: [], // Assuming this is an array of TitanPosition
  // strongholdPositions: [], // Assuming this is an array of StrongholdPosition
};

export const GameBoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameBoard, dispatch] = useReducer(
    gameBoardReducer,
    initialGameBoardState
  );

  const updateGameBoard = (partialState: Partial<GameBoardState>) => {
    dispatch({ type: "UPDATE_GAME_BOARD", payload: partialState });
  };

  return (
    <GameBoardContext.Provider value={{ gameBoard, updateGameBoard }}>
      {children}
    </GameBoardContext.Provider>
  );
};

// Define the shape of your context
interface GameState {
  gameState: GameSessionInfo;
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

type Selector<T> = (state: GameSessionInfo) => T;

export const useGameStatePart = <T,>(
  selector: (state: GameSessionInfo) => T
): T => {
  const { gameState } = useGameContext();
  const selectedState = useMemo(
    () => selector(gameState),
    [gameState, selector]
  );

  return selectedState;
};

const gameReducer = (state: GameSessionInfo, action: any) => {
  switch (action.type) {
    case "INITIAL_GAME_STATE":
      return { ...state, ...action.payload };
    case "UPDATE_GAME_STATE":
      return { ...state, ...action.payload };
    case "UPDATE_PLAYER_DATA":
      return {
        ...state,
        players: state.players.map((player) =>
          player.username === action.payload.username ? action.payload : player
        ),
      };
    default:
      return state;
  }
};
// Derive GameBoardState from GameState
const deriveGameBoardState = (gameState: GameSessionInfo): GameBoardState => {
  // Implement logic to derive GameBoardState from GameState
  // For example:
  return {
    playerPositions: gameState.players.map((player) => ({
      playerId: player.username, // assuming playerId is the same as username
      x: player.col, // assuming this is the x-coordinate
      y: player.row, // assuming this is the y-coordinate
    })),
    titanPositions: gameState.titans.map((titan) => ({
      titanId: titan.titanName, // assuming playerId is the same as username
      x: titan.col, // assuming this is the x-coordinate
      y: titan.row, // assuming this is the y-coordinate
    })),
    // strongholdPositions: gameState.players.map(player => {
    //   // Check if player.strongHold is defined
    //   if (player.strongHold) {
    //     return {
    //       owner: player.username,
    //       x: player.strongHold.col, // Now we are sure strongHold is defined
    //       y: player.strongHold.row
    //     };
    //   }
    //   return null; // Return null or some default value if strongHold is undefined
    // }).filter(position => position !== null) // Filter out null values
  };
};

// GameContext definition
interface GameContextState {
  gameState: GameSessionInfo;
  gameBoard: GameBoardState; // Derived state
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const GameContext = createContext<GameContextState | undefined>(undefined);

// Use GameContext Hook
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

// GameProvider Component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, dispatch] = useReducer(gameReducer, null);

  useEffect(() => {
    // Handler for receiving initial game state
    const handleInitialGameState = (initialState: GameSessionInfo) => {
      dispatch({ type: "INITIAL_GAME_STATE", payload: initialState });
    };

    // Set up socket listener for the initial game state
    socket.on("matchFound", handleInitialGameState);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("matchFound", handleInitialGameState);
    };
  }, []);

  useEffect(() => {
    const handleGameStateUpdate = (updatedState: GameSessionInfo) => {
      dispatch({ type: "UPDATE_GAME_STATE", payload: updatedState });
    };

    socket.on("updateGameState", handleGameStateUpdate);

    return () => {
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, []);

  const emitGameStateUpdate = (updatedData: Partial<GameSessionInfo>) => {
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

  const updatePlayerData = (updatedPlayer: PlayerInfo) => {
    dispatch({ type: "UPDATE_PLAYER_DATA", payload: updatedPlayer });
  };

  const gameBoard = useMemo(
    () => (gameState ? deriveGameBoardState(gameState) : initialGameBoardState),
    [gameState]
  );

  const providerValue = useMemo(
    () => ({
      gameState,
      gameBoard,
      emitGameStateUpdate,
      updatePlayerData,
    }),
    [gameState, gameBoard]
  );

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};
