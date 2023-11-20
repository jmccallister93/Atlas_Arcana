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
      onGameStateUpdate(newGameState);
    };
    socket.on("updateGameState", handleGameStateUpdate);
    return () => {
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, [sessionId, onGameStateUpdate]);

   // Update individual player rank
//    const updatePlayerRank = (playerId: string, newRank: number) => {
//     if (!gameState) return;

//     const newState: GameSessionInfo = {
//       ...gameState,
//       players: gameState.players.map(player =>
//         player.id === playerId ? { ...player, rank: newRank } : player
//       )
//     };

//     setGameState(newState);
//     socket.emit("updateGameState", { sessionId, newState });
//   };
  return null;
}
export default GameSocket;
