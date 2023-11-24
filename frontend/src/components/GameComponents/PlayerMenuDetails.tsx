import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "./Interfaces";
import EquipmentMenuDetails from "./EquipmentMenuDetails";

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
  updatePlayerData,
}) => {
  // State for the confirmation modal
  const [showRankUpConfirmation, setShowRankUpConfirmation] =
    useState<boolean>(false);
  const [selectedItemForRankUp, setSelectedItemForRankUp] =
    useState<EquipmentItem | null>(null);
  const [rankUpButtons, setRankUpButtons] = useState();

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
      equippedItems: updatedEquippedItems,
    };

    // Use updatePlayerData to update the player's data
    updatePlayerData(updatedPlayer);
  };

  // Updated handleRankUpGear to work with a specific item
  const handleRankUpGear = (
    event: React.MouseEvent<HTMLIonButtonElement>,
    item: EquipmentItem
  ) => {
    // Directly check prerequisites
    const hasWhetstone = player.inventory.treasures.includes("Whetstone");
    const hasForge = player.buildings.equipment.forge !== 0;
    const hasResources = player.inventory.resources > 3;
    const rankUpPrereq = hasWhetstone || (hasForge && hasResources);
    // Check prerequisites
    if (rankUpPrereq) {
      // Set the selected item
      setSelectedItemForRankUp(item);
      // Show confirmation modal
      setShowRankUpConfirmation(true);
    } else {
      alert("Cannot rank up. Missing prerequisites");
    }
  };
  // Function to actually perform the rank up
  const confirmRankUp = (useResources: boolean) => {
    if (selectedItemForRankUp && player) {
      if (useResources) {
        // Check if the player has enough resources
        if (player.inventory.resources >= 4) {
          // Deduct the resources
          player.inventory.resources -= 4;
        } else {
          alert("Not enough resources for rank up.");
          return; // Exit if not enough resources
        }
      } else {
        // Remove Whetstone from inventory
        const whetstoneIndex = player.inventory.treasures.indexOf("Whetstone");
        if (whetstoneIndex > -1) {
          player.inventory.treasures.splice(whetstoneIndex, 1);
        } else {
          alert("No Whetstone available for rank up.");
          return; // Exit if no Whetstone is found
        }
      }

      // Upgrade the selected item to Rank 2
      const itemIndex = player.inventory.equipment.findIndex(
        (item) => item.equipmentName === selectedItemForRankUp.equipmentName
      );
      if (itemIndex > -1) {
        player.inventory.equipment[itemIndex].rank = 2; // Set rank to 2
      }

      // Update the player data
      updatePlayerData(player);

      // Close the confirmation modal
      setShowRankUpConfirmation(false);
    }
  };
  //Generate rank up buttons
  const generateRankUpButtons = () => {
    let buttons = [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => setShowRankUpConfirmation(false),
      },
    ];

    const hasWhetstone = player.inventory.treasures.includes("Whetstone");
    const hasForge = player.buildings.equipment.forge !== 0;
    const hasResources = player.inventory.resources >= 4;
    // Show both options if all prerequisites are met
    if (hasWhetstone && hasForge && hasResources) {
      buttons.push({
        text: "Use and lose Whetstone",
        role: "confirm",
        cssClass: "primary",
        handler: () => confirmRankUp(false),
      });
      buttons.push({
        text: "Use and lose 4 Resources",
        role: "confirm",
        cssClass: "primary",
        handler: () => confirmRankUp(true),
      });
    } else {
      // Show Whetstone option if available
      if (hasWhetstone) {
        buttons.push({
          text: "Use and lose Whetstone",
          role: "confirm",
          cssClass: "primary",
          handler: () => confirmRankUp(false),
        });
      }

      // Show Resources option if available
      if (hasForge && hasResources) {
        buttons.push({
          text: "Use and lose 4 Resources",
          role: "confirm",
          cssClass: "primary",
          handler: () => confirmRankUp(true),
        });
      }
    }

    return buttons;
  };

  return (
    <>
      {detailType !== "Equipment Cards" &&
      detailType !== "Weapon" &&
      detailType !== "Armor" &&
      detailType !== "Amulet" &&
      detailType !== "Boots" &&
      detailType !== "Gloves" ? (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
          <div className="playerMenuContainer">
            <div className="backButton">
              <IonIcon icon={arrowBack} onClick={onClose} />
            </div>
            <h3>{detailType}</h3>
            <p>{detailContent}</p>
          </div>
        </IonModal>
      ) : (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
          <div className="playerMenuContainer">
            <div className="backButton">
              <IonIcon icon={arrowBack} onClick={onClose} />
            </div>
            <EquipmentMenuDetails
              equipableItems={equipableItems}
              player={player}
              updatePlayerData={updatePlayerData}
            />
          </div>
        </IonModal>
      )}
    </>
  );
};

export default PlayerMenuDetails;
