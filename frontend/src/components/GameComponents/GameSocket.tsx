import { useEffect } from 'react';
import socket from '../../context/SocketClient/socketClient';
import { GameSessionInfo } from '../../components/GameComponents/Interfaces';

interface GameSocketProps {
  sessionId?: string;
  gameState?: GameSessionInfo; 
  setGameState: (newState: GameSessionInfo) => void; 
  onGameStateUpdate: (newGameState: GameSessionInfo) => void;
}

const GameSocket: React.FC<GameSocketProps> = ({ sessionId, gameState, setGameState, onGameStateUpdate }) => {
  
  // Join the game session
  useEffect(() => {
    socket.emit("joinGame", { sessionId });
  }, [sessionId]);

  // Listen for game state updates
  useEffect(() => {
    const handleGameStateUpdate = (newGameState: GameSessionInfo) => {
        console.log("From GameSocket.tsx newGameState: ", newGameState)
      onGameStateUpdate(newGameState);
    };
    
    socket.on("updateGameState", handleGameStateUpdate);

    // Cleanup listener on unmount
    return () => {
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, [onGameStateUpdate]);

  return null; // This component does not render anything
}

export default GameSocket;
