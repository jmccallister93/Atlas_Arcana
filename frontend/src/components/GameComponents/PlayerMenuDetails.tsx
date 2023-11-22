import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "./Interfaces";

interface PlayerMenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string;
  detailContent: string;
  equipableItems?: any[];
  onEquipItem: (item: EquipmentItem) => void;
  player: PlayerInfo;
}

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({
  isOpen,
  onClose,
  detailType,
  detailContent,
  equipableItems,
  onEquipItem,
  player,
}) => {
    const [hasWhetstone, setHasWhetstone] = useState<boolean>(false);
    const [hasForge, setHasForge] = useState<boolean>(false);
    const [hasRankUpResources, setHasRankUpResources] = useState<boolean>(false);
  const [rankUpPrereq, setRankUpPrereq] = useState<boolean>(false);
  const [attunePrereq, setAttunePrereq] = useState<boolean>(false);

  // Rankup check
  useEffect(() => {
    let hasWhetstone = false;
    let hasForge = false;
    let hasResources = false;
    // Check for Whetstone
    if (player.inventory.treasures.includes("Whetstone")) {
        setHasWhetstone(true);
    }
    if (player.buildings.equipment.forge.length > 0) {
        setHasForge(true);
    }
    if (player.inventory.resources > 3) {
        setHasRankUpResources(true);
    }

    if (hasWhetstone) {
      setRankUpPrereq(true);
    } else if (hasForge && hasResources) {
      setRankUpPrereq(true);
    }
  }, [player]);

  // attunement check
  useEffect(() => {
    let hasEmber = false;
    let hasAttunementShrine = false;
    let hasResources = false;
    // Check for Whetstone
    if (player.inventory.treasures.includes("Whetstone")) {
      hasEmber = true;
    }
    if (player.buildings.equipment.forge.length > 0) {
      hasAttunementShrine = true;
    }
    if (player.inventory.resources > 3) {
      hasResources = true;
    }

    if (hasEmber) {
      setAttunePrereq(true);
    } else if (hasAttunementShrine && hasResources) {
      setAttunePrereq(true);
    }
  }, [player]);

  // Check for Ember
  const hasEmber = player.inventory.treasures.some((treasure) =>
    treasure.startsWith("Ember")
  );
  // Function to rank up an item
  const rankUpItem = (item: EquipmentItem) => {
    // Implement logic to increase rank and update player inventory
  };

  // Function to change element of an item
  const changeItemElement = (item: EquipmentItem, newElement: string) => {
    // Implement logic to change element and update player inventory
  };
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div className="playerMenuContainer">
        <div className="backButton">
          <IonIcon icon={arrowBack} onClick={onClose} />
        </div>
        <h3>{detailType}</h3>
        <p>{detailContent}</p>
        {equipableItems && equipableItems.length > 0 && (
          <div>
            <h4>Equipable Items</h4>
            {equipableItems.map((item: any, index: any) => {
              // Cast slot to keyof PlayerInfo["equippedItems"] to ensure type safety
              const slot = item.slot as keyof PlayerInfo["equippedItems"];

              // Check if the item is equipped
              const isEquipped = player.equippedItems[slot]?.some(
                (equippedItem) =>
                  equippedItem.equipmentName === item.equipmentName
              );

              return (
                <div key={index} className={`equipmentDetails `}>
                  <div key={index} className="equipmentDetails">
                    <p>
                      <strong>Name:</strong> {item.equipmentName}
                      {isEquipped ? (
                        <IonButton>Equipped</IonButton>
                      ) : (
                        <IonButton
                          onClick={() => onEquipItem(item)}
                          color="success"
                        >
                          Equip
                        </IonButton>
                      )}
                    </p>
                    <p>
                      <strong>Rank:</strong> {item.rank}
                      {rankUpPrereq ? (
                        <IonButton color="tertiary">Rank Up</IonButton>
                      ) : (
                        <IonButton color="medium" title="">Rank Up</IonButton>
                      )}
                    </p>
                    <p>
                      <strong>Slot:</strong> {item.slot}
                    </p>
                    <p>
                      <strong>Set:</strong> {item.set}
                    </p>
                    <p>
                      <strong>Element:</strong> {item.element}
                      <IonButton color="secondary">Attune Element</IonButton>
                    </p>
                    <p>
                      <strong>Bonus:</strong> {item.bonus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </IonModal>
  );
};

export default PlayerMenuDetails;
