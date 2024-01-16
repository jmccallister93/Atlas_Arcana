import React, { useState } from "react";
import { IonAlert, IonButton } from "@ionic/react";
import { EquipmentItem, PlayerInfo } from "../Interfaces";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface EquipGearProps {
  equipableItems: EquipmentItem[];
  item: EquipmentItem;
  player: PlayerInfo;
  isEquipped: boolean;
}

const EquipGear: React.FC<EquipGearProps> = ({
  equipableItems,
  item,
  player,
  isEquipped,
}) => {
  const { gameState, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );

  // State for the alert
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

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
    amulet: { stat: "totalHealth", increment: 1 },
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
    Water: { stat: "totalHealth", increment: 1 },
    Wind: { stat: "movement", increment: 1 },
    Stone: { stat: "defense", increment: 1 },
  };

  // Equip item
  const equipItem = (
    itemToEquip: EquipmentItem,
    player: PlayerInfo,
    updatePlayerData: (player: PlayerInfo) => void
  ) => {
    if (
      currentPlayer &&
      currentPlayer.username !== gameState.currentPlayerTurn &&
      gameState.currentPhase !== "Rest"
    ) {
      return;
    }
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
      const newPlayer = {
        ...player,
        [statKey]: newStatValue,
        equippedItems: {
          ...player.equippedItems,
          [slot]: [itemToEquip],
        },
      };
      updatePlayerData(newPlayer);
    }
  };
  //   Unequip item
  const unequipItem = (
    itemToUnequip: EquipmentItem,
    player: PlayerInfo,
    updatePlayerData: (player: PlayerInfo) => void
  ) => {
    if (
      currentPlayer &&
      currentPlayer.username !== gameState.currentPlayerTurn &&
      gameState.currentPhase !== "Rest"
    ) {
      return;
    }
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

  const handleEquipAction = (itemToEquip: EquipmentItem) => {
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

    equipItem(itemToEquip, player, updatePlayerData);
  };

  const handleUnequipAction = (itemToUnequip: EquipmentItem) => {
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

    unequipItem(itemToUnequip, player, updatePlayerData);
  };

  return (
    <>
      <strong>Name:</strong> {item.equipmentName}
      {isEquipped ? (
        <IonButton
          onClick={() => handleUnequipAction(item)}
          color="warning"
          title="To Equip or Unequip gear, must be your turn, in Rest Phase"
        >
          Unequip
        </IonButton>
      ) : (
        <IonButton
          onClick={() => handleEquipAction(item)}
          color="success"
          title="To Equip or Unequip gear, must be your turn, in Rest Phase"
        >
          Equip
        </IonButton>
      )}
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

export default EquipGear;
