import { PlayerInfo } from "../Interfaces";

interface TreasureMenuDetailsProps {
  usableTreasure?: any[];
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const TreasureMenuDetails: React.FC<TreasureMenuDetailsProps> = ({
  usableTreasure,
  player,
  updatePlayerData,
}) => {
  return <></>;
};

export default TreasureMenuDetails;
