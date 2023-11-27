import { PlayerInfo } from "../Interfaces";

interface TreasureMenuDetailsProps {
    treasureItem?: any;
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const TreasureMenuDetails: React.FC<TreasureMenuDetailsProps> = ({
    treasureItem,
  player,
  updatePlayerData,
}) => {
    console.log("From treasue detes:", treasureItem)
  return (
    <>
      {" "}
      <div>
        <h3>Treasure Detail</h3>
        <p>{treasureItem.treasureName}</p>
        {/* Additional logic and rendering for the treasure item */}
      </div>
    </>
  );
};

export default TreasureMenuDetails;
