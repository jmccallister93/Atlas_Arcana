import { IonButton, IonCheckbox, IonItem, IonModal } from "@ionic/react";
import React, { useState } from "react";
import { EquipmentItem, PlayerInfo, TreasureItem } from "../../Interfaces";

interface ToPlayerTradeProps {
  showToPlayerTrade: boolean;
  setShowToPlayerTrade: (showToPlayerTrade: boolean) => void;
  toTradeOffer: {
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  };
  setToTradeOffer: (tradeOffer: {
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }) => void;
}

const ToPlayerTrade: React.FC<ToPlayerTradeProps> = ({
  showToPlayerTrade,
  setShowToPlayerTrade,
  toTradeOffer,
  setToTradeOffer,
}) => {
  const [returnTradeOffer, setReturnTradeOffer] = useState<{
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }>({
    equipment: [],
    treasures: [],
    resources: 0,
  });
  const toggleEquipmentItem = (item: EquipmentItem) => {
    setReturnTradeOffer((prevOffer) => ({
      ...prevOffer,
      equipment: prevOffer.equipment.includes(item)
        ? prevOffer.equipment.filter((e) => e !== item)
        : [...prevOffer.equipment, item],
    }));
  };

  const toggleTreasureItem = (item: TreasureItem) => {
    setReturnTradeOffer((prevOffer) => ({
      ...prevOffer,
      treasures: prevOffer.treasures.includes(item)
        ? prevOffer.treasures.filter((t) => t !== item)
        : [...prevOffer.treasures, item],
    }));
  };

  const isEquipmentItemInOffer = (item: EquipmentItem) => {
    return toTradeOffer.equipment.includes(item);
  };

  const isTreasureItemInOffer = (item: TreasureItem) => {
    return toTradeOffer.treasures.includes(item);
  };

  return (
    <IonModal isOpen={true}>
      <h1>Trade Offer from player</h1>
      <h3>Equipment</h3>
      {toTradeOffer.equipment.map((card) => (
        <IonItem key={card.equipmentName}>{card.equipmentName}</IonItem>
      ))}
      <h3>Treasure</h3>
      {toTradeOffer.treasures.map((card) => (
        <IonItem key={card.treasureName}>{card.treasureName}</IonItem>
      ))}
      <h3>Resources</h3>
      {toTradeOffer.resources}
      <h2>Return Offer</h2>
      <h3>Select Equipment to Trade:</h3>
      {/* {player?.inventory.equipment.map((card) => (
        <IonItem key={card.equipmentName}>
          {card.equipmentName}{" "}
          <IonCheckbox
            checked={isEquipmentItemInOffer(card)}
            onIonChange={() => toggleEquipmentItem(card)}
          ></IonCheckbox>
        </IonItem>
      ))}
      <h3>Select Treasures to Trade:</h3>
      {player?.inventory.treasures.map((card) => (
        <IonItem key={card.treasureName}>
          {card.treasureName}
          <IonCheckbox
            checked={isTreasureItemInOffer(card)}
            onIonChange={() => toggleTreasureItem(card)}
          ></IonCheckbox>
        </IonItem>
      ))}
      <h3>Select Resources to Trade:</h3>
      <IonItem>
        <IonButton>-</IonButton>
        <span>{player?.inventory.resources}</span>
        <IonButton>+</IonButton>
        <IonCheckbox></IonCheckbox>
      </IonItem> */}
    </IonModal>
  );
};

export default ToPlayerTrade;