import socket from "../../../context/SocketClient/socketClient";
import { useEffect, useState } from "react";

interface PlayersInGameProps {
  playerNames: string[];
}

const PlayersInGame: React.FC<PlayersInGameProps> = ({ playerNames }) => {
    

  return (
    <>
      {" "}
      <h4 className="pageHeader">Players in Game:</h4>
      <div className="playerList">
        {playerNames?.map((player, index) => (
          <div key={index} className="playerName">
            {player}
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayersInGame;
