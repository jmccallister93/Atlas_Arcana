import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "./Interfaces";

interface PlayerMenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string;
  detailContent: string;
  equipableItems?: any[];
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({
  isOpen,
  onClose,
  detailType,
  detailContent,
  equipableItems,
  player,
  updatePlayerData
}) => {
  // Rank up variables
  const [hasWhetstone, setHasWhetstone] = useState<boolean>(false);
  const [hasForge, setHasForge] = useState<boolean>(false);
  const [hasRankUpResources, setHasRankUpResources] = useState<boolean>(false);
  const [missingRankUp, setMissingRankUp] = useState<string>(
    "Missing Whetsone, or Forge and Resources"
  );
  const [rankUpPrereq, setRankUpPrereq] = useState<boolean>(false);

  // State for the confirmation modal
const [showRankUpConfirmation, setShowRankUpConfirmation] = useState<boolean>(false);
const [selectedItemForRankUp, setSelectedItemForRankUp] = useState<EquipmentItem | null>(null);

  //   Attunement variables
  const [hasEmber, setHasEmber] = useState<boolean>(false);
  const [hasAttunementShrine, setHasAttunementShrine] =
    useState<boolean>(false);
  const [hasAttunementResources, setHasAttunementResources] =
    useState<boolean>(false);
  const [missingAttunement, setMissingAttunement] = useState<string>(
    "Missing Ember, or Attunement Shrine and Resources"
  );
  const [attunementPrereq, setAttunementPrereq] = useState<boolean>(false);

  // Rankup check
  useEffect(() => {
    // Check for Whetstone
    if (player.inventory.treasures.includes("Whetstone")) {
      setHasWhetstone(true);
      setMissingRankUp("Requirements Met");
    }
    if (player.buildings.equipment.forge.length > 0) {
      setHasForge(true);
      setMissingRankUp("Missing Resources or Forge");
    }
    if (player.inventory.resources > 3) {
      setHasRankUpResources(true);
      setMissingRankUp("Missing Forge or Whestone");
    }

    if (hasWhetstone) {
      setRankUpPrereq(true);
      setMissingRankUp("Requirements Met");
    } else if (hasForge && hasRankUpResources) {
      setRankUpPrereq(true);
      setMissingRankUp("Requirements Met");
    }
  }, [player]);

  // attunement check
  useEffect(() => {
    // Check for ember
    if (
      player.inventory.treasures.some((treasure) =>
        treasure.startsWith("Ember")
      )
    ) {
      setMissingRankUp("Requirements Met");
      setHasEmber(true);
    }
    if (player.buildings.equipment.attunementShrine.length > 0) {
      setHasAttunementShrine(true);
      setMissingRankUp("Missing Resources or Ember");
    }
    if (player.inventory.resources > 3) {
      setHasAttunementResources(true);
      setMissingRankUp("Missing Attunement Srhine or Ember");
    }

    if (hasEmber) {
      setAttunementPrereq(true);
      setMissingRankUp("Requirements Met");
    } else if (hasAttunementShrine && hasAttunementResources) {
      setAttunementPrereq(true);
      setMissingRankUp("Requirements Met");
    }
  }, [player]);

  // Function to equip up an item
  const equipItem = (itemToEquip: EquipmentItem) => {
    // Update the equipped items for the current player
    const updatedEquippedItems = {
      ...player.equippedItems,
      [itemToEquip.slot]: [itemToEquip], // Assuming you want to replace the item in the slot
    };

    // Create an updated player object
    const updatedPlayer = {
      ...player,
      equippedItems: updatedEquippedItems
    };

    // Use updatePlayerData to update the player's data
    updatePlayerData(updatedPlayer);
  };
// Updated handleRankUpGear to work with a specific item
const handleRankUpGear = (event: React.MouseEvent<HTMLIonButtonElement>, item: EquipmentItem) => {
    // Check prerequisites
    if (rankUpPrereq) {
      // Set the selected item
      setSelectedItemForRankUp(item);
      // Show confirmation modal
      setShowRankUpConfirmation(true);
    } else {
      alert('Cannot rank up: ' + missingRankUp);
    }
  };
  // Function to actually perform the rank up
  const confirmRankUp = () => {
    if (selectedItemForRankUp && player) {
      // 1. Remove Whetstone from inventory
      const whetstoneIndex = player.inventory.treasures.indexOf('Whetstone');
      if (whetstoneIndex > -1) {
        player.inventory.treasures.splice(whetstoneIndex, 1);
      } else {
        alert('No Whetstone available for rank up.');
        return; // Exit if no Whetstone is found
      }
  
      // 2. Upgrade the selected item to Rank 2
      // Assuming you want to update the rank of the item in the player's equipment array
      const itemIndex = player.inventory.equipment.findIndex(
        (item) => item.equipmentName === selectedItemForRankUp.equipmentName
      );
      if (itemIndex > -1) {
        player.inventory.equipment[itemIndex].rank = 2; // Set rank to 2
      }
  
      // 3. Update the player data
      updatePlayerData(player);
  
      // Close the confirmation modal
      setShowRankUpConfirmation(false);
    }
  };
  
  return (
    <>
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
                <div key={index} className='equipmentDetails'>
                  <p>
                    <strong>Name:</strong> {item.equipmentName}
                    {isEquipped ? (
                      <IonButton color="warning">Equipped</IonButton>
                    ) : (
                      <IonButton
                        onClick={() => equipItem(item)}
                        color="success"
                      >
                        Equip
                      </IonButton>
                    )}
                  </p>
                  <p>
                    <strong>Rank:</strong> {item.rank}
                    {rankUpPrereq ? (
                      <IonButton color="tertiary" onClick={(e) => handleRankUpGear(e, item)}>Rank Up</IonButton>
                    ) : (
                      <IonButton color="medium" title={missingRankUp}>
                        Rank Up
                      </IonButton>
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
                    {attunementPrereq ? (
                      <IonButton color="tertiary" >Attune</IonButton>
                    ) : (
                      <IonButton color="medium" title={missingAttunement}>
                        Attune
                      </IonButton>
                    )}
                  </p>
                  <p>
                    <strong>Bonus:</strong> {item.bonus}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </IonModal>
     <IonAlert
     isOpen={showRankUpConfirmation}
     onDidDismiss={() => setShowRankUpConfirmation(false)}
     header={'Rank Up Gear'}
     message={`Use ${hasWhetstone ? 'Whetstone' : 'Forge'} for rank up? This will remove necessary resources.`}
     buttons={[
       {
         text: 'Cancel',
         role: 'cancel',
         cssClass: 'secondary',
         handler: () => setShowRankUpConfirmation(false)
       },
       {
         text: 'Confirm',
         handler: () => confirmRankUp()
       }
     ]}
   />
   </>
  );
};

export default PlayerMenuDetails;
