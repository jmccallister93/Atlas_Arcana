import React, { useState } from "react";
import { IonAlert, IonButton } from "@ionic/react";
import { EquipmentItem, PlayerInfo } from "../Interfaces";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface RankupGearProps {
  equipableItems: EquipmentItem[];
  player: PlayerInfo;
}

const RankupGear: React.FC<RankupGearProps> = ({ equipableItems, player }) => {
  const { gameState, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );

  const [showRankUpConfirmation, setShowRankUpConfirmation] =
    useState<boolean>(false);
  const [selectedItemForRankUp, setSelectedItemForRankUp] =
    useState<EquipmentItem | null>(null);

  // State for the alert
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Function to check if a specific type of building is present
  const isBuildingPresent = (buildingType: string): boolean => {
    return (
      Array.isArray(player.buildings.equipment) &&
      player.buildings.equipment.some(
        (building) => building.type === buildingType && building.count > 0
      )
    );
  };

  // Updated handleRankUpGear to work with a specific item
  const handleRankUpGear = (
    event: React.MouseEvent<HTMLIonButtonElement>,
    item: EquipmentItem
  ) => {
    // Check if the item is equipped
    const isEquipped = Object.values(player.equippedItems)
      .flat()
      .some(
        (equippedItem) => equippedItem.equipmentName === item.equipmentName
      );

    if (isEquipped) {
      alert("Item must be unequipped to rank up.");
      return;
    }
    // Directly check prerequisites
    const hasWhetstone = player.inventory.treasures.some(
      (treasure) => treasure.treasureName === "Whetstone"
    );
    const hasForge = isBuildingPresent("forge");
    const hasResources = player.inventory.resources > 3;
    const rankUpPrereq = hasWhetstone || (hasForge && hasResources);
    // Check prerequisites
    if (rankUpPrereq) {
      // Set the selected item
      setSelectedItemForRankUp(item);
      // Show confirmation modal
      setShowRankUpConfirmation(true);
    } else {
      setShowAlert(true);

      setAlertMessage("Missing Whetstone or Forge and Resources");
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
        const whetstoneIndex = player.inventory.treasures.findIndex(
          (treasure) => treasure.treasureName === "Whetstone"
        );
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
        const currentItem = player.inventory.equipment[itemIndex];

        // Ensure the rank is treated as a number and increment it if less than 3
        const currentRank = Number(currentItem.rank);
        if (currentRank < 3) {
          player.inventory.equipment[itemIndex].rank = currentRank + 1;
        } else {
          alert("Item is already at maximum rank.");
          return; // Exit if the item is already at max rank
        }
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

    const hasWhetstone = player.inventory.treasures.some(
      (treasure) => treasure.treasureName === "Whetstone"
    );
    const hasForge = isBuildingPresent("forge");
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
          text: "Use Forge and lose 4 Resources",
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
      {equipableItems.map((item, key) => (
        <p>
          <b>Rank:</b> {item.rank}
          <IonButton
            color={"tertiary"}
            onClick={(e) => handleRankUpGear(e, item)}
          >
            Rank Up
          </IonButton>
        </p>
      ))}

      <IonAlert
        isOpen={showRankUpConfirmation}
        onDidDismiss={() => setShowRankUpConfirmation(false)}
        header={"Rank Up Gear"}
        message={"Choose your rank up method:"}
        buttons={generateRankUpButtons()}
      />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Alert"}
        message={alertMessage}
        buttons={["OK"]}
      />
    </>
  );
};

export default RankupGear;
