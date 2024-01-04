import { useEffect, useState } from "react";
import {
  EquipmentItem,
  GameSessionInfo,
  PlayerInfo,
  TreasureItem,
} from "../../Interfaces";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonList,
  IonModal,
} from "@ionic/react";
import "../../GameTurns/GameTurn.scss";
import socket from "../../../../context/SocketClient/socketClient";
import { use } from "matter";

export interface TradePhaseProps {}

const TradePhase: React.FC<TradePhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );

  const [showTradePhaseDetails, setShowTradePhaseDetails] = useState(true);
  const [showTradeWindow, setShowTradeWindow] = useState(false);
  const [playerToTradeWith, setPlayerToTradeWith] = useState<PlayerInfo>();
  const [equipmentCardsToTrade, setEquipmentCardsToTrade] =
    useState<EquipmentItem[]>();
  const [treasureCardsToTrade, setTreasureCardsToTrade] =
    useState<TreasureItem[]>();
  const [resourcesToTrade, setResourcesToTrade] = useState<number>(0);
  const [tradeOffer, setTradeOffer] = useState<{
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }>({
    equipment: [],
    treasures: [],
    resources: 0,
  });
  const [isNegotiationAccepted, setIsNegotiationAccepted] = useState(false);
  const [isTradeMade, setIsTradeMade] = useState(false);

  const toggleEquipmentItem = (item: EquipmentItem) => {
    setTradeOffer((prevOffer) => ({
      ...prevOffer,
      equipment: prevOffer.equipment.includes(item) 
        ? prevOffer.equipment.filter(e => e !== item)
        : [...prevOffer.equipment, item],
    }));
  };

  const toggleTreasureItem = (item: TreasureItem) => {
    setTradeOffer((prevOffer) => ({
      ...prevOffer,
      treasures: prevOffer.treasures.includes(item) 
        ? prevOffer.treasures.filter(t => t !== item)
        : [...prevOffer.treasures, item],
    }));
  };

  const isEquipmentItemInOffer = (item: EquipmentItem) => {
    return tradeOffer.equipment.includes(item);
  };

  const isTreasureItemInOffer = (item: TreasureItem) => {
    return tradeOffer.treasures.includes(item);
  };

  useEffect(() => {
    console.log(tradeOffer);
  }, [tradeOffer]);

  const playersToTradewith = gameState.players
    .filter((player) => player.username !== currentPlayer?.username)
    .map((player) => player.username);

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

  // const addToTradeOffer = (type: string, item: any) => {
  //   setTradeOffer(prevOffer => ({
  //     ...prevOffer,
  //     [type]: type === 'resources' ? item : [...prevOffer[type], item]
  //   }));
  // };

  // const sendTradeRequest = (player: PlayerInfo) => {
  //   socket.emit("sendTradeRequest", {
  //     sessionId: gameState.sessionId, // Assuming this is how you access the session ID
  //     fromPlayerId: currentPlayer.id, // Send the ID of the current player
  //     toPlayerId: player.id, // Send the ID of the player you want to trade with
  //     tradeOffer: tradeOffer, // The trade offer details
  //   });
  // };

  const acceptTrade = () => {
    // Logic to accept the trade and update the game state
  };

  const declineTrade = () => {
    // Logic to decline the trade
  };

  return (
    <div className="gameturnMenuContainer">
      <IonButton onClick={() => setShowTradePhaseDetails(true)}>
        Trade Options
      </IonButton>
      <IonModal
        isOpen={showTradePhaseDetails}
        onDidDismiss={() => setShowTradePhaseDetails(false)}
      >
        <h1>Trading Phase</h1>
        <h2>Select Equipment to Trade:</h2>
        {currentPlayer?.inventory.equipment.map((card) => (
          <IonItem key={card.equipmentName}>
            {card.equipmentName}{" "}
            <IonCheckbox 
          checked={isEquipmentItemInOffer(card)}
          onIonChange={() => toggleEquipmentItem(card)}
        ></IonCheckbox>
          </IonItem>
        ))}
        <h2>Select Treasures to Trade:</h2>
        {currentPlayer?.inventory.treasures.map((card) => (
          <IonItem key={card.treasureName}>
            {card.treasureName}
            <IonCheckbox 
          checked={isTreasureItemInOffer(card)}
          onIonChange={() => toggleTreasureItem(card)}
        ></IonCheckbox>
          </IonItem>
        ))}
        <h2>Select Resources to Trade:</h2>
        <IonItem>
          <IonButton onClick={decrementResources}>-</IonButton>
          <span>{currentPlayer?.inventory.resources}</span>
          <IonButton onClick={incrementResources}>+</IonButton>
          <IonCheckbox></IonCheckbox>
        </IonItem>
        {playersToTradewith.map((player) => (
          <IonButton>Offer to {player}</IonButton>
        ))}

        <IonButton onClick={() => setShowTradePhaseDetails(false)}>
          Close
        </IonButton>
      </IonModal>
    </div>
  );
};

export default TradePhase;
