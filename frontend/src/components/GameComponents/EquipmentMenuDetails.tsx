import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "./Interfaces";

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

  const [selectedElementForAttune, setSelectedElementForAttune] = useState<
    string | null
  >(null);
  const [showElementSelection, setShowElementSelection] =
    useState<boolean>(false);
  const elementTypes = ["Fire", "Water", "Wind", "Stone"];

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
    // Directly check prerequisites
    const emberTypes = [
      "Ember Fire",
      "Ember Water",
      "Ember Wind",
      "Ember Stone",
    ];
    const availableEmbers = emberTypes.filter((ember) =>
      player.inventory.treasures.includes(ember)
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
      const emberIndex = player.inventory.treasures.indexOf(emberType);
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
    const availableEmbers = emberTypes.filter((ember) =>
      player.inventory.treasures.includes(ember)
    );
    const hasShrine = player.buildings.equipment.attunementShrine !== 0;
    const hasResources = player.inventory.resources > 3;

    // Add a button for each available Ember type
    availableEmbers.forEach((emberType) => {
      buttons.push({
        text: `Use and lose ${emberType}`,
        role: "confirm",
        cssClass: "primary",
        handler: () => confirmAttuneWithEmber(emberType),
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
                    <IonButton color="warning">Equipped</IonButton>
                  ) : (
                    <IonButton onClick={() => equipItem(item)} color="success">
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
