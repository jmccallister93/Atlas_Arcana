import React from "react";
import { useGameContext } from "../../../context/GameContext/GameContext";




const PlayersInGame: React.FC = () => {
  const { gameState } = useGameContext();
  const playerNames = gameState.players.map(player => player.username);

  return (
    <>
      <h4 className="pageHeader">Players in Game:</h4>
      <div className="playerList">
        {playerNames.map((player, index) => (
          <div key={index} className="playerName">
            {player}
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayersInGame;
