import { ReactElement, useEffect, useState } from "react";
import { EquipmentItem, PlayerInfo, TreasureItem } from "../../Interfaces";
import { IonButton, IonCheckbox, IonItem, IonModal } from "@ionic/react";
import "../GameTurn.scss";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import socket from "../../../../context/SocketClient/socketClient";
import TradeOffer from "./TradeOffer";

interface PlayersTradewindowProps {
  tradePartnerId: PlayerInfo | undefined;
}
const PlayersTradeWindow: React.FC<PlayersTradewindowProps> = ({
  tradePartnerId,
}) => {
  const { gameState } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );

  interface TradeOffer {
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }

  type ItemType = "equipment" | "treasures";

  interface TradeState {
    [playerId: string]: TradeOffer; // Replace 'playerId' with 'username' if using usernames
  }

  const [tradeState, setTradeState] = useState<TradeState>({});

  const [resourcesToTrade, setResourcesToTrade] = useState<number>(0);
  const [tradeDisplayOffer, setTradeDisplayOffer] = useState<TradeState>({});
  const [equipmentItemsForTrade, setEquipmentItemsForTrade] =
    useState<ReactElement>();

    useEffect(() => {
      const initialTradeState: TradeState = {};
      gameState.players.forEach((player) => {
        initialTradeState[player.username] = {
          equipment: [],
          treasures: [],
          resources: 0,
        };
      });
      setTradeState(initialTradeState);
    }, [gameState.players]);

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

  const addToOffer = (
    playerId: string,
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    setTradeState((prevState) => {
      // Clone the previous state's offer for the specific player
      const updatedOffer = prevState[playerId] || {
        equipment: [],
        treasures: [],
        resources: 0,
      };

      console.log("Add to offer item:",item)

      if (itemType === "equipment" && isEquipmentItem(item)) {
        updatedOffer.equipment = [...updatedOffer.equipment, item];
      } else if (itemType === "treasures" && isTreasureItem(item)) {
        updatedOffer.treasures = [...updatedOffer.treasures, item];
      }

      return { ...prevState, [playerId]: updatedOffer };
    });
  };

  // Type guard for EquipmentItem
  function isEquipmentItem(
    item: EquipmentItem | TreasureItem
  ): item is EquipmentItem {
    return (item as EquipmentItem).equipmentName !== undefined;
  }

  // Type guard for TreasureItem
  function isTreasureItem(
    item: EquipmentItem | TreasureItem
  ): item is TreasureItem {
    return (item as TreasureItem).treasureName !== undefined;
  }

  const removeFromOffer = (
    playerId: string,
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    setTradeState((prevState) => {
      // Check if the player's offer exists, and if not, return the previous state
      if (!prevState[playerId]) {
        return prevState;
      }

      const updatedOffer = prevState[playerId] || {
        equipment: [],
        treasures: [],
        resources: 0,
      };

      // Update the appropriate item list (equipment or treasures) by removing the specified item
      if (itemType === "equipment" && isEquipmentItem(item)) {
        updatedOffer.equipment = updatedOffer.equipment.filter(
          (i) => i !== item
        );
      } else if (itemType === "treasures" && isTreasureItem(item)) {
        updatedOffer.treasures = updatedOffer.treasures.filter(
          (i) => i !== item
        );
      }

      // Return the updated state with the modified offer for the player
      return {
        ...prevState,
        [playerId]: updatedOffer,
      };
    });
  };

  const isItemInCurrentPlayerOffer = (
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ): boolean => {
    // Assuming the keys in tradeState are usernames
    if (!currentPlayer) return false;
    const currentPlayerUsername = currentPlayer.username;
    const tradeOffer = tradeState[currentPlayerUsername];
    if (!tradeOffer) return false;
    if (itemType === "equipment" && isEquipmentItem(item)) {
      return tradeOffer?.equipment.includes(item);
    } else if (itemType === "treasures" && isTreasureItem(item)) {
      return tradeOffer?.treasures.includes(item);
    }
  
    return false;
  };

  const toggleItemInCurrentPlayerOffer = (
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    if (!currentPlayer) return;
    if (isItemInCurrentPlayerOffer(item, itemType)) {
      removeFromOffer(currentPlayer.username, item, itemType);
    } else {
      addToOffer(currentPlayer?.username, item, itemType);
    }
  };
  
  // const toggleItemInCurrentPlayerOffer = (
  //   item: EquipmentItem | TreasureItem,
  //   itemType: ItemType
  // ) => {
  //   if (!currentPlayer) return;
  //   if (isItemInCurrentPlayerOffer(item, itemType)) {
  //     removeFromOffer(currentPlayer.username, item, itemType);
  //     socket.emit("addToTrade", {
  //       sessionId: gameState.sessionId,
  //       playerId: currentPlayer,
  //       tradeState: tradeState,
  //     });
  //   } else {
  //     addToOffer(currentPlayer?.username, item, itemType);
  //     socket.emit("addToTrade", {
  //       sessionId: gameState.sessionId,
  //       playerId: currentPlayer,
  //       tradeState: tradeState,
  //     });
  //   }
  // };
  useEffect(() => {
    // Emit the trade state whenever it changes
    socket.emit("addToTrade", {
      sessionId: gameState.sessionId,
      playerId: currentPlayer,
      tradeState: tradeState,
    });
  }, [tradeState, gameState.sessionId, currentPlayer]);

  useEffect(() => {
    socket.on("tradeAdded", (data: TradeState) => {
      // Make sure the data type matches TradeState
      console.log("Trade added:", data);
      setTradeDisplayOffer(data); // Assuming data is of type TradeState
    });
    return () => {
      socket.off("tradeAdded");
    };
  }, []);

  useEffect(() => {
    const tradePartner = tradePartnerId?.username; // or tradePartnerId?.username

    const offerKey =
      tradePartner && tradePartner !== currentPlayer?.username // or currentPlayer?.username
        ? tradePartner // Use trade partner's offer if they are not the current player
        : currentPlayer?.username; // Use current player's offer otherwise
  if(!offerKey) return;
        
 // Ensure that the offerKey is valid and tradeDisplayOffer[offerKey] exists and is an object
  const offer = tradeDisplayOffer[offerKey];
  if (!offer || typeof offer !== 'object') return;

  // Ensure that the equipment property exists and is an array before mapping over it
  if (Array.isArray(offer.equipment)) {
    setEquipmentItemsForTrade(
      <IonItem>
        {offer.equipment.map((item) => (
          <li key={item.equipmentName}>{item.equipmentName}</li>
        ))}
      </IonItem>
    );
  }
    if(!tradeDisplayOffer[offerKey].treasures) return;
    console.log(tradeDisplayOffer[offerKey].equipment)
  }, [tradeDisplayOffer]);
 
  return (
    <div className="tradeWindowContainer">
      <div className="tradeWindowHeader">
        Trading with {tradePartnerId?.username}
      </div>
      <div className="tradeWindowDetailsContainer">
        <div className="currentPlayerInventory">
          <h3>Select Equipment to Trade:</h3>
          {currentPlayer?.inventory.equipment.map((equipmentItem) => (
            <IonItem key={equipmentItem.equipmentName}>
              {equipmentItem.equipmentName}{" "}
              <IonCheckbox
                checked={isItemInCurrentPlayerOffer(equipmentItem, "equipment")}
                onIonChange={() =>
                  toggleItemInCurrentPlayerOffer(equipmentItem, "equipment")
                }
              ></IonCheckbox>
            </IonItem>
          ))}
          <h3>Select Treasures to Trade:</h3>
          {currentPlayer?.inventory.treasures.map((treasureItem) => (
            <IonItem key={treasureItem.treasureName}>
              {treasureItem.treasureName}
              <IonCheckbox
                checked={isItemInCurrentPlayerOffer(treasureItem, "treasures")}
                onIonChange={() =>
                  toggleItemInCurrentPlayerOffer(treasureItem, "treasures")
                }
              ></IonCheckbox>
            </IonItem>
          ))}
          <h3>Select Resources to Trade:</h3>
          <IonItem>
            <IonButton onClick={decrementResources}>-</IonButton>
            <span>{currentPlayer?.inventory.resources}</span>
            <IonButton onClick={incrementResources}>+</IonButton>
            <IonCheckbox></IonCheckbox>
          </IonItem>
        </div>
        <div className="partnerTradeItems">
          <h3>Trade offer from {tradePartnerId?.username}</h3>

          <div>
            <h4>Equipment:</h4>

            {equipmentItemsForTrade}

            <h4>Treasures:</h4>
            <IonItem>
              {/* {tradeDisplayOffer?[
                currentPlayer?.username === auth.username
                  ? "secondPlayerOffer"
                  : "firstPlayerOffer"
              ].treasures.map((item) => (
                <li key={item.treasureName}>{item.treasureName}</li>
              ))} */}
            </IonItem>
            <h4>Resources:</h4>
            <p>
              {/* {
                tradeState[
                  currentPlayer?.username === auth.username
                    ? "secondPlayerOffer"
                    : "firstPlayerOffer"
                ].resources
              } */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayersTradeWindow;
