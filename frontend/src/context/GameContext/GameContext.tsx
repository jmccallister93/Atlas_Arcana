import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import {
  GameBoard,
  GameSessionInfo,
  PlayerInfo,
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

// Game board updates
export const useGameBoard = () => {
  const { gameState, emitGameStateUpdate } = useGameContext();

  const gameBoard = gameState.gameBoard; // Get the game board from gameState

  // Function to update the game board state
  const updateGameBoard = (updatedGameBoard: Partial<GameBoard>) => {
    emitGameStateUpdate({ gameBoard: { ...gameBoard, ...updatedGameBoard } });
  };

  return { gameBoard, updateGameBoard };
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
      case "UPDATE_GAME_BOARD":
        return {
          ...state,
          gameBoard: { ...state.gameBoard, ...action.payload },
        };
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
