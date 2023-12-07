import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

export interface CombatPhaseProps {
  gameState?: GameSessionInfo;
  players: PlayerInfo[];
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  currentPlayer: PlayerInfo | undefined;
}

const CombatPhase: React.FC<CombatPhaseProps> = ({
  currentPlayer,
  emitGameStateUpdate,
  gameState,
  players,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <div> It's Combating time</div>
    </>
  );
};

export default CombatPhase;
