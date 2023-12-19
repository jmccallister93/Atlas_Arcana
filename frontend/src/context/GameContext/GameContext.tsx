import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
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
  buildingPositions: BuildingPosition[];
  strongholdPositions: StrongholdPosition[];
}

const initialGameBoardState: GameBoardState = {
  playerPositions: [],
  titanPositions: [],
  buildingPositions: [],
  strongholdPositions: [],
};

const GameBoardContext = createContext<{
  gameBoard: GameBoardState;
  updateGameBoard: (partialState: Partial<GameBoardState>) => void;
} | undefined>(undefined);

export const useGameBoardContext = () => {
  const context = useContext(GameBoardContext);
  if (!context) {
    throw new Error("useGameBoardContext must be used within a GameBoardProvider");
  }
  return context;
};

const gameBoardReducer = (state: GameBoardState, action: any): GameBoardState => {
  switch (action.type) {
    case "UPDATE_GAME_BOARD":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const GameBoardProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [gameBoard, dispatch] = useReducer(gameBoardReducer, initialGameBoardState);

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

// Create the context
const GameContext = createContext<GameState | undefined>(undefined);

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
      // case "UPDATE_GAME_BOARD":
      //   return {
      //     ...state,
      //     gameBoard: { ...state.gameBoard, ...action.payload },
      //   };
      case "SET_CURRENT_PLAYER_TURN":
        return {
          ...state,
          gameState: { ...state, currentPlayerTurn: action.payload },
        };
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
    // Assuming dispatch updates gameState correctly
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

  useEffect(() => {
    console.log("From Gamecontext gameState:", gameState);
  }, [gameState]);

  const providerValue = useMemo(() => {
    return { gameState, emitGameStateUpdate, updatePlayerData };
  }, [gameState]);

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};
