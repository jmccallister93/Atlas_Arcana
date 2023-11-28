import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "../Interfaces";

interface EquipmentMenuDetailsProps {
  equipableItems?: any[];
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}
const EquipmentMenuDetails: React.FC<EquipmentMenuDetailsProps> = ({
  equipableItems,
  player,
  updatePlayerData,
}) => {
  // State for the confirmation modal
  const [showRankUpConfirmation, setShowRankUpConfirmation] =
    useState<boolean>(false);
  const [selectedItemForRankUp, setSelectedItemForRankUp] =
    useState<EquipmentItem | null>(null);
  const [showAttuneConfirmation, setShowAttuneConfirmation] =
    useState<boolean>(false);
  const [selectedItemForAttune, setSelectedItemForAttune] =
    useState<EquipmentItem | null>(null);
  const [showElementSelection, setShowElementSelection] =
    useState<boolean>(false);
  const elementTypes = ["Fire", "Water", "Wind", "Stone"];

  // EquipmentSlot type
  type EquipmentSlot = "weapon" | "armor" | "amulet" | "boots" | "gloves";

  // StatUpdate type
  type StatUpdate = {
    stat: keyof PlayerInfo;
    increment: number;
  };

  // Mapping from slot to stat update
  const statUpdateMap: Record<EquipmentSlot, StatUpdate> = {
    weapon: { stat: "offense", increment: 1 },
    armor: { stat: "defense", increment: 1 },
    amulet: { stat: "health", increment: 1 },
    boots: { stat: "movement", increment: 1 },
    gloves: { stat: "build", increment: 1 },
  };
  //   element update type
  type ElementUpdate = {
    stat: keyof PlayerInfo;
    increment: number;
  };
  // Mapping from slot to stat update
  const elementUpdateMap: Record<string, ElementUpdate> = {
    Fire: { stat: "offense", increment: 1 },
    Water: { stat: "health", increment: 1 },
    Wind: { stat: "movement", increment: 1 },
    Stone: { stat: "defense", increment: 1 },
  };
  // Equip item
  const equipItem = (
    itemToEquip: EquipmentItem,
    player: PlayerInfo,
    updatePlayerData: (player: PlayerInfo) => void
  ) => {
    let updatedPlayer = player;
    const slot = itemToEquip.slot as EquipmentSlot;

    if (Object.keys(statUpdateMap).includes(slot)) {
      const update = statUpdateMap[slot];
      let increment = update.increment;

      if (itemToEquip.rank == 2) {
        increment = 2;
      } else if (itemToEquip.rank == 3) {
        increment = 3;
      }
      const statKey = update.stat;
      const currentStatValue = player[statKey] as number;
      let newStatValue = currentStatValue + increment;

      if (itemToEquip.element !== "none") {
        const element = itemToEquip.element;
        const elementUpdate = elementUpdateMap[element];
        const elementStatKey = elementUpdate.stat;
        const elementStatIncrement = elementUpdate.increment;

        if (statKey === elementStatKey) {
          newStatValue += elementStatIncrement;
        } else {
          (updatedPlayer[elementStatKey] as number) =
            (player[elementStatKey] as number) + elementStatIncrement;
        }
      }

      (updatedPlayer[statKey] as number) = newStatValue;

      updatedPlayer.equippedItems[slot] = [itemToEquip];

      updatePlayerData(updatedPlayer);
    }
  };
  //   Unequip item
  const unequipItem = (
    itemToUnequip: EquipmentItem,
    player: PlayerInfo,
    updatePlayerData: (player: PlayerInfo) => void
  ) => {
    const slot = itemToUnequip.slot as EquipmentSlot;

    if (Object.keys(statUpdateMap).includes(slot)) {
      const update = statUpdateMap[slot];
      let decrement = update.increment;

      if (itemToUnequip.rank == 2) {
        decrement += 1;
      } else if (itemToUnequip.rank == 3) {
        decrement += 2;
      }

      const statKey = update.stat;
      const currentStatValue = player[statKey] as number;
      let newStatValue = Math.max(currentStatValue - decrement, 0); // Prevent negative values

      if (itemToUnequip.element !== "none") {
        const elementUpdate = elementUpdateMap[itemToUnequip.element];
        const elementStatKey = elementUpdate.stat;
        const elementStatIncrement = elementUpdate.increment;

        if (statKey === elementStatKey) {
          newStatValue = Math.max(newStatValue - elementStatIncrement, 0);
        } else {
          (player[elementStatKey] as number) = Math.max(
            (player[elementStatKey] as number) - elementStatIncrement,
            0
          );
        }
      }

      (player[statKey] as number) = newStatValue;

      player.equippedItems[slot] = [];

      updatePlayerData(player);
    }
  };

  // Updated handleRankUpGear to work with a specific item
  const handleRankUpGear = (
    event: React.MouseEvent<HTMLIonButtonElement>,
    item: EquipmentItem
  ) => {
      // Check if the item is equipped
  const isEquipped = Object.values(player.equippedItems).flat().some(
    equippedItem => equippedItem.equipmentName === item.equipmentName
  );

  if (isEquipped) {
    alert("Item must be unequipped to rank up.");
    return; // Exit the function if the item is equipped
  }
    // Directly check prerequisites
    const hasWhetstone = player.inventory.treasures.some(
      (treasure) => treasure.treasureName === "Whetstone"
    );
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
          text: "Use Forge and lose 4 Resources",
          role: "confirm",
          cssClass: "primary",
          handler: () => confirmRankUp(true),
        });
      }
    }

    return buttons;
  };

  // Updated handleRankUpGear to work with a specific item
  const handleAttuneGear = (
    event: React.MouseEvent<HTMLIonButtonElement>,
    item: EquipmentItem
  ) => {
      // Check if the item is equipped
  const isEquipped = Object.values(player.equippedItems).flat().some(
    equippedItem => equippedItem.equipmentName === item.equipmentName
  );

  if (isEquipped) {
    alert("Item must be unequipped to attune.");
    return; // Exit the function if the item is equipped
  }
    // Directly check prerequisites
    const emberTypes = [
      "Ember Fire",
      "Ember Water",
      "Ember Wind",
      "Ember Stone",
    ];
    const availableEmbers = player.inventory.treasures.filter((treasure) =>
  emberTypes.includes(treasure.treasureName)
);

    const hasShrine = player.buildings.equipment.attunementShrine !== 0;
    const hasResources = player.inventory.resources > 3;
    const attunePrereq =
      availableEmbers.length > 0 || (hasShrine && hasResources);
    // Check prerequisites
    if (attunePrereq) {
      // Set the selected item
      setSelectedItemForAttune(item);
      // Show confirmation modal
      setShowAttuneConfirmation(true);
    } else {
      alert("Cannot Attune. Missing prerequisites");
    }
  };

  // Attune with Ember
  const confirmAttuneWithEmber = (emberType: string) => {
    if (selectedItemForAttune && player) {
      const emberIndex = player.inventory.treasures.findIndex(
        (treasure) => treasure.treasureName === emberType
      );
      if (emberIndex > -1) {
        player.inventory.treasures.splice(emberIndex, 1);
        const element = emberType.split(" ")[1]; // Extracts the element type from Ember type

        const itemIndex = player.inventory.equipment.findIndex(
          (item) => item.equipmentName === selectedItemForAttune.equipmentName
        );
        if (itemIndex > -1) {
          player.inventory.equipment[itemIndex].element = element;
        }

        updatePlayerData(player);
        setShowAttuneConfirmation(false);
      } else {
        alert(`No ${emberType} available for attunement.`);
      }
    }
  };
  //   Attune with Shrine
  const confirmAttuneWithShrine = (selectedElement: string) => {
    if (selectedItemForAttune && player) {
      if (player.inventory.resources >= 4) {
        player.inventory.resources -= 4;

        const itemIndex = player.inventory.equipment.findIndex(
          (item) => item.equipmentName === selectedItemForAttune.equipmentName
        );
        if (itemIndex > -1) {
          player.inventory.equipment[itemIndex].element = selectedElement;
        }

        updatePlayerData(player);
        setShowAttuneConfirmation(false);
        setShowElementSelection(false); // Also close the element selection alert
      } else {
        alert("Not enough resources for attunement.");
      }
    }
  };

  //Generate rank up buttons
  const generateAttuneButtons = () => {
    let buttons = [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => setShowAttuneConfirmation(false),
      },
    ];

    const emberTypes = [
      "Ember Fire",
      "Ember Water",
      "Ember Wind",
      "Ember Stone",
    ];
// This is the same as the second scenario, so the same logic applies.
const availableEmbers = player.inventory.treasures.filter((treasure) =>
  emberTypes.includes(treasure.treasureName)
);

    const hasShrine = player.buildings.equipment.attunementShrine !== 0;
    const hasResources = player.inventory.resources > 3;

    // Add a button for each available Ember type
    availableEmbers.forEach((emberType) => {
      buttons.push({
        text: `Use and lose ${emberType.treasureName}`,
        role: "confirm",
        cssClass: "primary",
        handler: () => confirmAttuneWithEmber(emberType.treasureName),
      });
    });

    // Add the option to choose an element for attunement
    if (hasShrine && hasResources) {
      buttons.push({
        text: "Use Attunement Shrine and lose 4 Resources",
        role: "confirm",
        cssClass: "primary",
        handler: () => {
          setShowElementSelection(true); // Show a new modal for element selection
        },
      });
    }

    return buttons;
  };

  return (
    <>
      {" "}
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
              <div key={index} className="equipmentDetails">
                <p>
                  <strong>Name:</strong> {item.equipmentName}
                  {isEquipped ? (
                    <IonButton
                      onClick={() =>
                        unequipItem(item, player, updatePlayerData)
                      }
                      color="warning"
                    >
                      Unequip
                    </IonButton>
                  ) : (
                    <IonButton
                      onClick={() => equipItem(item, player, updatePlayerData)}
                      color="success"
                    >
                      Equip
                    </IonButton>
                  )}
                </p>
                <p>
                  <strong>Rank:</strong> {item.rank}
                  <IonButton
                    color={"tertiary"}
                    onClick={(e) => handleRankUpGear(e, item)}
                  >
                    Rank Up
                  </IonButton>
                </p>
                <p>
                  <strong>Slot:</strong> {item.slot}
                </p>
                <p>
                  <strong>Set:</strong> {item.set}
                </p>
                <p>
                  <strong>Element:</strong> {item.element}
                  <IonButton
                    color={"tertiary"}
                    onClick={(e) => handleAttuneGear(e, item)}
                  >
                    Attune
                  </IonButton>
                </p>
                <p>
                  <strong>Bonus:</strong> {item.bonus}
                </p>
              </div>
            );
          })}
        </div>
      )}{" "}
      <IonAlert
        isOpen={showRankUpConfirmation}
        onDidDismiss={() => setShowRankUpConfirmation(false)}
        header={"Rank Up Gear"}
        message={"Choose your rank up method:"}
        buttons={generateRankUpButtons()}
      />
      <IonAlert
        isOpen={showAttuneConfirmation}
        onDidDismiss={() => setShowAttuneConfirmation(false)}
        header={"Attune Gear"}
        message={"Choose your attunement method:"}
        buttons={generateAttuneButtons()}
      />
      <IonAlert
        isOpen={showElementSelection}
        onDidDismiss={() => setShowElementSelection(false)}
        header={"Select Attunement Element"}
        inputs={elementTypes.map((element) => ({
          name: "element",
          type: "radio",
          label: element,
          value: element,
        }))}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => setShowElementSelection(false),
          },
          {
            text: "OK",
            handler: (element) => {
              // 'data' is an object with keys as the name of the inputs
              console.log(element); // Debugging

              confirmAttuneWithShrine(element); // Proceed with attunement using resources
            },
          },
        ]}
      />
    </>
  );
};

export default EquipmentMenuDetails;
