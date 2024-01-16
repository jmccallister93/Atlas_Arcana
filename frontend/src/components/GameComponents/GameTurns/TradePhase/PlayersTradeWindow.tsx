import { ReactElement, useEffect, useState } from "react";
import { EquipmentItem, PlayerInfo, TreasureItem } from "../../Interfaces";
import {
  IonAlert,
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonModal,
} from "@ionic/react";
import "../GameTurn.scss";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import socket from "../../../../context/SocketClient/socketClient";
import { closeOutline } from "ionicons/icons";

interface PlayersTradewindowProps {
  tradePartnerId: PlayerInfo | undefined;
  tradeSessionId?: string;
  onClose: () => void;
  declineTrade: () => void;
  setShowActiveTradeWindow: (show: boolean) => void;
  setIsTradeRequestCompleteAlertVisible: (show: boolean) => void;
  setShowIncomingTradeRequest: (show: boolean) => void;
}
const PlayersTradeWindow: React.FC<PlayersTradewindowProps> = ({
  tradePartnerId,
  tradeSessionId,
  onClose,
  declineTrade,
  setShowActiveTradeWindow,
  setIsTradeRequestCompleteAlertVisible,
  setShowIncomingTradeRequest,
}) => {
  const { gameState, updatePlayerData } = useGameContext();
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
  const [treasureItemsForTrade, setTreasureItemsForTrade] =
    useState<ReactElement>();
  const [resourceItemsForTrade, setResourceItemsForTrade] =
    useState<ReactElement>();
  const [includeResourcesInOffer, setIncludeResourcesInOffer] =
    useState<boolean>(false);
  const [isTradeOfferAccepted, setIsTradeOfferAccepted] =
    useState<boolean>(false);
  const [isTradeOfferPending, setIsTradeOfferPending] =
    useState<boolean>(false);
  const [isTradeOfferFinalized, setIsTradeOfferFinalized] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    EquipmentItem | TreasureItem | null
  >(null);

  // Accept the trade offer
  const acceptTradeOffer = () => {
    setIsTradeOfferAccepted(true);
    setIsTradeOfferPending(true); // Set to pending until the other player responds
    if (!currentPlayer) return;
    // Emit trade acceptance event to the server with relevant data
    socket.emit("tradeOfferAccepted", {
      tradeSessionId: tradeSessionId,
      sessionId: gameState.sessionId,
      playerId: currentPlayer.username,
    });
  };

  // Decline the trade offer
  const declineTradeOffer = () => {
    setIsTradeOfferAccepted(false);
    setIsTradeOfferPending(false);
    if (!currentPlayer) return;
    // Emit trade decline event to the server
    socket.emit("tradeOfferDeclined", {
      tradeSessionId: tradeSessionId,
      sessionId: tradeSessionId,
      playerId: currentPlayer.username,
    });
  };

  useEffect(() => {
    socket.on("tradeFinalized", (data) => {
      if (!currentPlayer) {
        return;
      }
      if (data.tradeSessionId === tradeSessionId) {
        if (data.status === "accepted") {
          console.log(data);
          const tradeDetails = data.currentTradeState;

          setIsTradeOfferFinalized(true);
          setIsTradeOfferPending(false);
          setShowActiveTradeWindow(false);
          setIsTradeRequestCompleteAlertVisible(true);
          setShowIncomingTradeRequest(false);
        }
      }
    });

    return () => {
      socket.off("tradeFinalized");
    };
  }, [socket, tradeSessionId]); // Make sure to include dependencies

  // Update the trade state when the trade partner's offer changes
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
  }, []);

  // Increment the resource amount in the offer local state
  const incrementResources = () => {
    if (!includeResourcesInOffer || !currentPlayer) return;

    const newResourceAmount = Math.min(
      resourcesToTrade + 1,
      currentPlayer.inventory.resources
    );
    setResourcesToTrade(newResourceAmount);
    updateResourceOffer(newResourceAmount);
  };

  // Decrement the resource amount in the offer local state
  const decrementResources = () => {
    if (!includeResourcesInOffer || resourcesToTrade <= 0) return;

    const newResourceAmount = resourcesToTrade - 1;
    setResourcesToTrade(newResourceAmount);
    updateResourceOffer(newResourceAmount);
  };

  // Update the resource offer when the includeResourcesInOffer state changes
  useEffect(() => {
    if (includeResourcesInOffer) {
      updateResourceOffer(resourcesToTrade);
    } else {
      updateResourceOffer(0); // Remove resources from the offer when unchecked
    }
  }, [includeResourcesInOffer, resourcesToTrade]);

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

  // Add to offer local state
  const addItemToOffer = (
    playerId: string,
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    setTradeState((prevState) => {
      // Clone the previous state's offer for the specific player
      const updatedOffer = prevState[playerId];

      if (itemType === "equipment" && isEquipmentItem(item)) {
        // Check if the item is already in the offer
        if (
          !updatedOffer.equipment.some(
            (e) => e.equipmentName === item.equipmentName
          )
        ) {
          updatedOffer.equipment = [...updatedOffer.equipment, item];
        }
      } else if (itemType === "treasures" && isTreasureItem(item)) {
        if (
          !updatedOffer.treasures.some(
            (t) => t.treasureName === item.treasureName
          )
        ) {
          updatedOffer.treasures = [...updatedOffer.treasures, item];
        }
      }

      return { ...prevState, [playerId]: updatedOffer };
    });
  };

  //remove from offer local state
  const removeItemFromOffer = (
    playerId: string,
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    setTradeState((prevState) => {
      // Check if the player's offer exists, and if not, return the previous state
      if (!prevState[playerId]) {
        return prevState;
      }

      const updatedOffer = { ...prevState[playerId] };

      // Update the appropriate item list (equipment or treasures) by removing the specified item
      if (itemType === "equipment" && isEquipmentItem(item)) {
        updatedOffer.equipment = updatedOffer.equipment.filter(
          (i) => i.equipmentName !== item.equipmentName
        );
      } else if (itemType === "treasures" && isTreasureItem(item)) {
        updatedOffer.treasures = updatedOffer.treasures.filter(
          (i) => i.treasureName !== item.treasureName
        );
      }

      // Return the updated state with the modified offer for the player
      return {
        ...prevState,
        [playerId]: updatedOffer,
      };
    });
  };

  // Add to offer local state
  const addResourceToOffer = (playerId: string, resourceAmount: number) => {
    setTradeState((prevState) => {
      const updatedOffer = prevState[playerId] || {
        equipment: [],
        treasures: [],
        resources: 0,
      };

      // Add the resource amount to the current offer
      updatedOffer.resources = resourceAmount;

      return { ...prevState, [playerId]: updatedOffer };
    });
  };

  // Check if an item is in the current player's offer
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

  // Update the resource amount in the offer local state
  const updateResourceOffer = (newResourceAmount: number) => {
    if (!currentPlayer) return;
    const currentPlayerUsername = currentPlayer.username;

    // Set the new resource amount for the current player's offer
    addResourceToOffer(currentPlayerUsername, newResourceAmount);
  };

  // Toggle item in offer local state
  const toggleItemInCurrentPlayerOffer = (
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    if (!currentPlayer) return;
    if (isItemInCurrentPlayerOffer(item, itemType)) {
      removeItemFromOffer(currentPlayer.username, item, itemType);
    } else {
      addItemToOffer(currentPlayer.username, item, itemType);
    }
  };

  // Socket call to add to trade state
  useEffect(() => {
    // Emit the trade state whenever it changes
    if (!currentPlayer || !tradePartnerId) return;
    socket.emit("addToTrade", {
      sessionId: tradeSessionId,
      playerId: currentPlayer,
      tradeState: tradeState,
    });
  }, [tradeState, gameState.sessionId, currentPlayer]);

  // Listen for trade state changes from the server
  useEffect(() => {
    socket.on("tradeAdded", (data: TradeState) => {
      // Make sure the data type matches TradeState

      setTradeDisplayOffer(data); // Assuming data is of type TradeState
    });
    return () => {
      socket.off("tradeAdded");
    };
  }, []);

  // Render partner trade offer
  useEffect(() => {
    const tradePartner = tradePartnerId?.username; // or tradePartnerId?.username

    const offerKey =
      tradePartner && tradePartner !== currentPlayer?.username // or currentPlayer?.username
        ? tradePartner // Use trade partner's offer if they are not the current player
        : currentPlayer?.username; // Use current player's offer otherwise
    if (!offerKey) return;

    // Ensure that the offerKey is valid and tradeDisplayOffer[offerKey] exists and is an object
    const offer = tradeDisplayOffer[offerKey];
    if (!offer || typeof offer !== "object") return;

    // Ensure that the equipment property exists and is an array before mapping over it
    if (Array.isArray(offer.equipment)) {
      setEquipmentItemsForTrade(
        <IonItem>
          {offer.equipment.map((item) => (
            <div key={item.equipmentName}>
              {item.equipmentName}
              <IonButton onClick={() => handleItemClick(item)}>VIEW</IonButton>
            </div>
          ))}
        </IonItem>
      );
    }
    if (Array.isArray(offer.equipment)) {
      setTreasureItemsForTrade(
        <IonItem>
          {offer.treasures.map((item) => (
            <div key={item.treasureName}>{item.treasureName}
              <IonButton onClick={() => handleItemClick(item)}>VIEW</IonButton></div>
            
          ))}
        </IonItem>
      );
    }
    if (typeof offer.resources === "number") {
      setResourceItemsForTrade(<IonItem>{offer.resources}</IonItem>);
    }
    // console.log(tradeDisplayOffer[offerKey].equipment)
  }, [tradeDisplayOffer]);
  // Close and decline offer
  const closeAndDecline = () => {
    declineTrade();
    onClose();
    socket.emit("tradeWindowClosed", {
      tradeSessionId: tradeSessionId,
      playerId: currentPlayer?.username,
    });
  };

  // Function to handle item click
  const handleItemClick = (item: EquipmentItem | TreasureItem) => {
    setSelectedItem(item);
  };

  // Function to close the item details
  const closeItemDetails = () => {
    setSelectedItem(null);
  };
  // Component or Function to render item details
  const renderItemDetails = (item: EquipmentItem | TreasureItem) => {
    let itemName = "";
    let itemDetails = null;

    // Check if the item is an EquipmentItem
    if ("equipmentName" in item) {
      itemName = item.equipmentName;
      // Add any other specific details for EquipmentItem
      itemDetails = (
        <>
          <p>
            <strong>Name:</strong>
            {item.equipmentName}
          </p>
          <p>
            <strong>Rank:</strong>
            {item.rank}
          </p>
          <p>
            <strong>Slot:</strong>
            {item.slot}
          </p>
          <p>
            <strong>Set:</strong>
            {item.set}
          </p>
          <p>
            <strong>Element:</strong>
            {item.element}
          </p>
          <p>
            <strong>Bonus:</strong>
            {item.bonus}
          </p>
        </>
      );
    }

    // Check if the item is a TreasureItem
    else if ("treasureName" in item) {
      itemName = item.treasureName;
      // Add any other specific details for TreasureItem
      itemDetails = (
        <>
          <p>
            <strong>Name:</strong>
            {item.treasureName}
          </p>
          <p>
            <strong>Description:</strong>
            {item.description}
          </p>
          <p>
            <strong>Reaction:</strong>
            {item.reaction}
          </p>
        </>
      );
    }

    return (
      <IonModal isOpen={!!item} onDidDismiss={closeItemDetails}>
        <div className="modalHeader">
          <h2>Item Details</h2>
          <button className="closeButton" onClick={closeItemDetails}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>
        <h2>{itemName}</h2>
        {itemDetails}
      </IonModal>
    );
  };

  return (
    <div className="tradeWindowContainer">
      <div className="modalHeader">
        <h3>Trading with {tradePartnerId?.username}</h3>
        <button className="closeButton" onClick={closeAndDecline}>
          <IonIcon icon={closeOutline} />
        </button>
      </div>
      <div className="tradeWindowDetailsContainer">
        <div className="currentPlayerInventory">
          <h3>Select Equipment to Trade:</h3>
          {currentPlayer?.inventory.equipment.map((equipmentItem) => (
            <IonItem key={equipmentItem.equipmentName}>
              {equipmentItem.equipmentName}{" "}
              <IonCheckbox
                // checked={isItemInCurrentPlayerOffer(equipmentItem, "equipment")}
                onIonChange={() =>
                  toggleItemInCurrentPlayerOffer(equipmentItem, "equipment")
                }
              ></IonCheckbox>
              <IonButton onClick={() => handleItemClick(equipmentItem)}>
                VIEW
              </IonButton>
            </IonItem>
          ))}

          <h3>Select Treasures to Trade:</h3>
          {currentPlayer?.inventory.treasures.map((treasureItem) => (
            <IonItem key={treasureItem.treasureName}>
              {treasureItem.treasureName}
              <IonCheckbox
                onIonChange={() =>
                  toggleItemInCurrentPlayerOffer(treasureItem, "treasures")
                }
              ></IonCheckbox>
              <IonButton onClick={() => handleItemClick(treasureItem)}>
                VIEW
              </IonButton>
            </IonItem>
          ))}

          <h3>Select Resources to Trade:</h3>
          <IonItem>
            <IonButton
              disabled={!includeResourcesInOffer}
              onClick={decrementResources}
            >
              -
            </IonButton>
            <span>{resourcesToTrade}</span>
            <IonButton
              disabled={!includeResourcesInOffer}
              onClick={incrementResources}
            >
              +
            </IonButton>
            <IonCheckbox
              checked={includeResourcesInOffer}
              onIonChange={() =>
                setIncludeResourcesInOffer(!includeResourcesInOffer)
              }
            ></IonCheckbox>
          </IonItem>
        </div>

        <div className="partnerTradeItems">
          <h3>Trade offer from {tradePartnerId?.username}</h3>
          <div>
            <h4>Equipment:</h4>
            {equipmentItemsForTrade}
            <h4>Treasures:</h4>
            {treasureItemsForTrade}
            <h4>Resources:</h4>
            {resourceItemsForTrade}
          </div>
        </div>
      </div>

      <div>
        {" "}
        {isTradeOfferPending ? (
          <>
            <IonButton disabled>Pending {tradePartnerId?.username}</IonButton>
            <IonButton onClick={declineTradeOffer}>Cancel Trade</IonButton>
          </>
        ) : (
          <>
            <IonButton onClick={acceptTradeOffer}>Accept Trade</IonButton>
            <IonButton onClick={declineTradeOffer}>Decline Trade</IonButton>
          </>
        )}
      </div>

      {/* Render Item Details Modal */}
      {selectedItem && renderItemDetails(selectedItem)}
    </div>
  );
};
export default PlayersTradeWindow;
