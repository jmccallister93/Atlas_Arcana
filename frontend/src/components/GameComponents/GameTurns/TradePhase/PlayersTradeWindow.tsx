import { useEffect, useState } from "react";
import { EquipmentItem, PlayerInfo, TreasureItem } from "../../Interfaces";
import { IonButton, IonCheckbox, IonItem, IonModal } from "@ionic/react";
import "../GameTurn.scss";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import socket from "../../../../context/SocketClient/socketClient";

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
  const [tradeDisplayPlayer, setTradeDisplayPlayer] = useState<string>();
  const [tradeDisplayOffer, setTradeDisplayOffer] = useState<{}>();

  interface TradeOffer {
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }

  type ItemType = "equipment" | "treasures";

  interface TradeState {
    firstPlayerOffer: TradeOffer;
    secondPlayerOffer: TradeOffer;
  }

  const [tradeState, setTradeState] = useState<TradeState>({
    firstPlayerOffer: {
      equipment: [],
      treasures: [],
      resources: 0,
    },
    secondPlayerOffer: {
      equipment: [],
      treasures: [],
      resources: 0,
    },
  });

  const [resourcesToTrade, setResourcesToTrade] = useState<number>(0);
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
    player: string | undefined,
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    const offerKey =
      player === currentPlayer?.username
        ? "firstPlayerOffer"
        : "secondPlayerOffer";
    setTradeState((prevState) => {
      // Clone the previous state's offer for the specific player
      const updatedOffer = { ...prevState[offerKey] };

      if (itemType === "equipment" && isEquipmentItem(item)) {
        updatedOffer.equipment = [...updatedOffer.equipment, item];
      } else if (itemType === "treasures" && isTreasureItem(item)) {
        updatedOffer.treasures = [...updatedOffer.treasures, item];
      }

      return {
        ...prevState,
        [offerKey]: updatedOffer,
      };
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
    player: string | undefined,
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    const offerKey =
      player === currentPlayer?.username
        ? "firstPlayerOffer"
        : "secondPlayerOffer";
    setTradeState((prevState) => ({
      ...prevState,
      [offerKey]: {
        ...prevState[offerKey],
        [itemType]: prevState[offerKey][itemType].filter((i) => i !== item),
      },
    }));
  };

  const isItemInCurrentPlayerOffer = (
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ): boolean => {
    const offer =
      currentPlayer?.username === auth.username
        ? tradeState.firstPlayerOffer
        : tradeState.secondPlayerOffer;

    if (itemType === "equipment" && isEquipmentItem(item)) {
      return offer.equipment.includes(item);
    } else if (itemType === "treasures" && isTreasureItem(item)) {
      return offer.treasures.includes(item);
    }

    return false;
  };

  const toggleItemInCurrentPlayerOffer = (
    item: EquipmentItem | TreasureItem,
    itemType: ItemType
  ) => {
    if (isItemInCurrentPlayerOffer(item, itemType)) {
      removeFromOffer(currentPlayer?.username, item, itemType);
      socket.emit("addToTrade", {
        sessionId: gameState.sessionId,
        playerId: currentPlayer,
        tradeState: tradeState,
      });
    } else {
      addToOffer(currentPlayer?.username, item, itemType);
      socket.emit("addToTrade", {
        sessionId: gameState.sessionId,
        playerId: currentPlayer,
        tradeState: tradeState,
      });
    }
  };

  useEffect(() => {
    socket.on("tradeAdded", (data: any) => {
      console.log("Trade added:", data);
      setTradeDisplayPlayer(data.playerId)
      setTradeDisplayOffer(data.tradeState)
    });
    return () => {
      socket.off("tradeAdded");
    };
  }, []);

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
            <IonItem>
            {currentPlayer?.username === auth.username
                  ? "secondPlayerOffer"
                  : "firstPlayerOffer"}
        
            </IonItem>
            <h4>Treasures:</h4>
            <IonItem>
              {tradeState[
                currentPlayer?.username === auth.username
                  ? "secondPlayerOffer"
                  : "firstPlayerOffer"
              ].treasures.map((item) => (
                <li key={item.treasureName}>{item.treasureName}</li>
              ))}
            </IonItem>
            <h4>Resources:</h4>
            <p>
              {
                tradeState[
                  currentPlayer?.username === auth.username
                    ? "secondPlayerOffer"
                    : "firstPlayerOffer"
                ].resources
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayersTradeWindow;
