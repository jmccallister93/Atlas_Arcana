import { useEffect } from 'react';
import socket from '../../context/SocketClient/socketClient';
import { GameSessionInfo } from '../../components/GameComponents/Interfaces';

interface GameSocketProps {
  sessionId?: string;
  onGameStateUpdate: (newGameState: GameSessionInfo) => void;
}

const GameSocket: React.FC<GameSocketProps> = ({ sessionId, onGameStateUpdate }) => {
  
  // Join the game session
  useEffect(() => {
    socket.emit("joinGame", { sessionId });
  }, [sessionId]);

  // Listen for game state updates
  useEffect(() => {
    const handleGameStateUpdate = (newGameState: GameSessionInfo) => {
      onGameStateUpdate(newGameState);
    };
    socket.on("updateGameState", handleGameStateUpdate);
    return () => {
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, [sessionId, onGameStateUpdate]);

  return null; // This component doesn't render anything
};

export default GameSocket;
