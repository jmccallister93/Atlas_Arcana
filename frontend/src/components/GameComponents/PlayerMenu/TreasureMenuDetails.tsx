import { PlayerInfo } from "../Interfaces";

interface TreasureMenuDetailsProps {
    treasureItems?: any;
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const TreasureMenuDetails: React.FC<TreasureMenuDetailsProps> = ({
    treasureItems,
  player,
  updatePlayerData,
}) => {
    console.log("From treasue detes:", treasureItems)
  return (
    <>
         <div>
        <h3>Treasure Details</h3>
        {treasureItems && treasureItems.length > 0 ? (
          treasureItems.map((item:any, index:any) => (
            <div key={index}>
              <p><b>{item.treasureName}</b></p>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>No quests available.</p>
        )}
      </div>
    </>
  );
};

export default TreasureMenuDetails;
