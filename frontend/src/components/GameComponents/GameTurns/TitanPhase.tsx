import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

export interface TitanPhaseProps {
  gameState?: GameSessionInfo;
  players: PlayerInfo[];
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  currentPlayer: PlayerInfo | undefined;
}

const TitanPhase: React.FC<TitanPhaseProps> = ({
  currentPlayer,
  emitGameStateUpdate,
  gameState,
  players,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <div> It's Titaning time</div>
    </>
  );
};

export default TitanPhase;
