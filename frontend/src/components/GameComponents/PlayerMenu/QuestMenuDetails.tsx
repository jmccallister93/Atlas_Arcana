import { PlayerInfo, QuestItem } from "../Interfaces"; // Assuming QuestItem is the interface for your quest items

interface QuestMenuDetailsProps {
  questItems?: any[]; 
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const QuestMenuDetails: React.FC<QuestMenuDetailsProps> = ({
  questItems,
  player,
  updatePlayerData,
}) => {
  console.log("From quest item details", questItems);

  return (
    <>
      <div>
        <h3>Quest Details</h3>
        {questItems && questItems.length > 0 ? (
          questItems.map((item, index) => (
            <div key={index}>
              <p><b>{item.questName}</b></p>
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

export default QuestMenuDetails;
