import { PlayerInfo } from "../Interfaces";

interface QuestMenuDetailsProps {
  questItem?: any;
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const QuestMenuDetails: React.FC<QuestMenuDetailsProps> = ({
  questItem,
  player,
  updatePlayerData,
}) => {
 console.log("From quest item details",questItem)
  return (
    <>
      {" "}
      <div>
        <h3>Quest Details</h3>
        <p><b>{questItem?.questName}</b></p>
        <p>{questItem?.description}</p>
        {/* Additional logic for interacting with quests can be added here */}
      </div>
    </>
  );
};

export default QuestMenuDetails;
