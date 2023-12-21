import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../context/GameContext/GameContext";

export interface TitanPhaseProps {

}

const TitanPhase: React.FC<TitanPhaseProps> = ({
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
      <div> It's Titaning time</div>
    </>
  );
};

export default TitanPhase;
