import React, { useState } from "react";
import { IonAlert, IonButton } from "@ionic/react";
import { EquipmentItem, PlayerInfo } from "../Interfaces";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface AttuneGearProps {
  equipableItems: EquipmentItem[];
  player: PlayerInfo;
}

const AttuneGear: React.FC<AttuneGearProps> = ({ equipableItems, player }) => {
  const { gameState, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );

  const [showAttuneConfirmation, setShowAttuneConfirmation] =
    useState<boolean>(false);
  const [selectedItemForAttune, setSelectedItemForAttune] =
    useState<EquipmentItem | null>(null);
  const [showElementSelection, setShowElementSelection] =
    useState<boolean>(false);
  const elementTypes = ["Fire", "Water", "Wind", "Stone"];

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

  // Updated handleAttuneGear to work with a specific item
  const handleAttuneGear = (
    event: React.MouseEvent<HTMLIonButtonElement>,
    item: EquipmentItem
  ) => {
    if (currentPlayer?.username !== gameState.currentPlayerTurn) {
      setAlertMessage("It's not your turn!");
      setShowAlert(true);
      return;
    }

    if (gameState.currentPhase !== "Rest") {
      setAlertMessage("It's not the Rest phase!");
      setShowAlert(true);
      return;
    }
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
    const emberTypes = [
      "Ember Fire",
      "Ember Water",
      "Ember Wind",
      "Ember Stone",
    ];
    const availableEmbers = player.inventory.treasures.filter((treasure) =>
      emberTypes.includes(treasure.treasureName)
    );

    const hasAttunementShrine = isBuildingPresent("attunementShrine");
    const hasResources = player.inventory.resources > 3;
    const attunePrereq =
      availableEmbers.length > 0 || (hasAttunementShrine && hasResources);
    // Check prerequisites
    if (attunePrereq) {
      // Set the selected item
      setSelectedItemForAttune(item);
      // Show confirmation modal
      setShowAttuneConfirmation(true);
    } else {
      setShowAlert(true);
      setAlertMessage("Missing Ember or Attunement Shrine and Resources");
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

    const hasAttunementShrine = isBuildingPresent("attunementShrine");
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
    if (hasAttunementShrine && hasResources) {
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
      {equipableItems.map((item, key) => (
        <p>
          <strong>Element:</strong> {item.element}
          <IonButton
            color={"tertiary"}
            onClick={(e) => handleAttuneGear(e, item)}
          >
            Attune
          </IonButton>
        </p>
      ))}

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

export default AttuneGear;
