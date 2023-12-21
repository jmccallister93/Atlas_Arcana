import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

export interface CombatPhaseProps {
}

const CombatPhase: React.FC<CombatPhaseProps> = ({

}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <div> It's Combating time</div>
    </>
  );
};

export default CombatPhase;
