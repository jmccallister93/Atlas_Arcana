import { IonButton, IonCheckbox, IonItem, IonModal } from "@ionic/react";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useState } from "react";
import { EquipmentItem, PlayerInfo, TreasureItem } from "../../Interfaces";
import socket from "../../../../context/SocketClient/socketClient";

interface FromPlayerTradeProps {
  showFromPlayerTrade: boolean;
  setShowFromPlayerTrade: (showFromPlayerTrade: boolean) => void;

  tradeOffer: {
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  };
  setTradeOffer: (offer: {
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }) => void;
}

const FromPlayerTrade: React.FC<FromPlayerTradeProps> = ({
  showFromPlayerTrade,
  setShowFromPlayerTrade,
  tradeOffer,
  setTradeOffer,
}) => {
  const { gameState } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );

  const [equipmentCardsToTrade, setEquipmentCardsToTrade] =
    useState<EquipmentItem[]>();
  const [treasureCardsToTrade, setTreasureCardsToTrade] =
    useState<TreasureItem[]>();
  const [resourcesToTrade, setResourcesToTrade] = useState<number>(0);

  const toggleEquipmentItem = (item: EquipmentItem) => {
  //   setTradeOffer((prevOffer) => ({
  //     ...prevOffer,
  //     equipment: prevOffer.equipment.includes(item)
  //       ? prevOffer.equipment.filter((e) => e !== item)
  //       : [...prevOffer.equipment, item],
  //   }));
  // };

  // const toggleTreasureItem = (item: TreasureItem) => {
  //   setTradeOffer((prevOffer) => ({
  //     ...prevOffer,
  //     treasures: prevOffer.treasures.includes(item)
  //       ? prevOffer.treasures.filter((t) => t !== item)
  //       : [...prevOffer.treasures, item],
  //   }));
  };

  const isEquipmentItemInOffer = (item: EquipmentItem) => {
    return tradeOffer.equipment.includes(item);
  };

  const isTreasureItemInOffer = (item: TreasureItem) => {
    return tradeOffer.treasures.includes(item);
  };

  const incrementResources = () => {
    if (resourcesToTrade >= currentPlayer?.inventory.resources) {
      return;
    } else {
      setResourcesToTrade(resourcesToTrade + 1);
    }
  };

  const decrementResources = () => {
    if (resourcesToTrade > 0) {
      setResourcesToTrade(resourcesToTrade - 1);
    }
  };

  return (
    <IonModal
      isOpen={showFromPlayerTrade}
      onDidDismiss={() => setShowFromPlayerTrade(false)}
    >
      <h1>Trading Phase</h1>
      <h3>Select Equipment to Trade:</h3>
      {currentPlayer?.inventory.equipment.map((card) => (
        <IonItem key={card.equipmentName}>
          {card.equipmentName}{" "}
          <IonCheckbox
            checked={isEquipmentItemInOffer(card)}
            onIonChange={() => toggleEquipmentItem(card)}
          ></IonCheckbox>
        </IonItem>
      ))}
      <h3>Select Treasures to Trade:</h3>
      {/* {currentPlayer?.inventory.treasures.map((card) => (
        <IonItem key={card.treasureName}>
          {card.treasureName}
          <IonCheckbox
            checked={isTreasureItemInOffer(card)}
            onIonChange={() => toggleTreasureItem(card)}
          ></IonCheckbox>
        </IonItem>
      ))} */}
      <h3>Select Resources to Trade:</h3>
      <IonItem>
        <IonButton onClick={decrementResources}>-</IonButton>
        <span>{currentPlayer?.inventory.resources}</span>
        <IonButton onClick={incrementResources}>+</IonButton>
        <IonCheckbox></IonCheckbox>
      </IonItem>

      <IonButton onClick={() => setShowFromPlayerTrade(false)}>Close</IonButton>
    </IonModal>
  );
};
export default FromPlayerTrade;
