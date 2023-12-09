import React from "react";;

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

const areEqual = (prevProps: any, nextProps: any) => {
  if (prevProps.playerNames !== nextProps.playerNames) {
    return false;  // Re-render if currentPlayer changes
  }

  return true; // Props are equal, don't re-render
};

export default React.memo(PlayersInGame, areEqual);
