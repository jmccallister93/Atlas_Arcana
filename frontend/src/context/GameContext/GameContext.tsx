import React, { createContext, useContext, useReducer, useEffect } from "react";
import { GameSessionInfo } from "../../components/GameComponents/Interfaces";
import socket, { onGameStateUpdate, offGameStateUpdate } from "../SocketClient/socketClient";

// Define the shape of your context
interface GameState {
  gameState: GameSessionInfo;
  updateGameState: (updatedData: Partial<GameSessionInfo>) => void;
}

// Create the context
const GameContext = createContext<GameState | undefined>(undefined);

// Helper hook to use the context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

const gameReducer = (state: GameSessionInfo, action: any) => {
  switch (action.type) {
    case "UPDATE_GAME_STATE":
        console.log("From game reducer state:",state)
        console.log("From game reducer action.payload:",action.payload)
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, {}); // initial state
  useEffect(() => {
    const handleInitialGameState = (newSession: GameSessionInfo) => {
      console.log("Game state initialized", newSession);
      dispatch({ type: "UPDATE_GAME_STATE", payload: newSession });
    };

    // Subscribe to game state updates
    socket.on("matchFound", handleInitialGameState)

    // Clean up the listener when the component unmounts
    return () => {
        socket.off("matchFound", handleInitialGameState);
    };
  }, []);
    console.log("GameState from gamecontext:",gameState)
    useEffect(() => {
        console.log("gameState changed:", gameState);
      }, [gameState]);
      
  const updateGameState = (updatedData: Partial<GameSessionInfo>) => {
    dispatch({ type: "UPDATE_GAME_STATE", payload: updatedData });
    // Here, also handle your socket.emit or Redis server updates
  };

  
  return (
    <GameContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </GameContext.Provider>
  );
};
