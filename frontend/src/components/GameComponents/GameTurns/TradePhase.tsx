import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

export interface TradePhaseProps {
  gameState?: GameSessionInfo;
  players: PlayerInfo[];
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  currentPlayer: PlayerInfo | undefined;
}

const TradePhase: React.FC<TradePhaseProps> = ({
  currentPlayer,
  emitGameStateUpdate,
  gameState,
  players,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <div> It's Tradeing time</div>
    </>
  );
};

export default TradePhase;
