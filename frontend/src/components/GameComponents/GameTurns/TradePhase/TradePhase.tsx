import { useState } from "react";
import {
  EquipmentItem,
  GameSessionInfo,
  PlayerInfo,
  TreasureItem,
} from "../../Interfaces";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { IonButton, IonItem, IonList, IonModal } from "@ionic/react";
import "../GameTurns/GameTurn.scss";
import socket from "../../../../context/SocketClient/socketClient";

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
  const [tradeOffer, setTradeOffer] = useState({
    equipment: [],
    treasures: [],
    resources: 0,
  });
  const [isNegotiationAccepted, setIsNegotiationAccepted] = useState(false);
  const [isTradeMade, setIsTradeMade] = useState(false);

  const openTradeWindow = (player: PlayerInfo) => {
    setShowTradeWindow(true);
    setPlayerToTradeWith(player);
    setEquipmentCardsToTrade(currentPlayer?.inventory.equipment);
    setTreasureCardsToTrade(currentPlayer?.inventory.treasures);
    setResourcesToTrade(currentPlayer?.inventory.resources);
  };

  const playersToTradewith = gameState.players
    .filter((player) => player.username !== currentPlayer?.username)
    .map((player) => (
      <IonButton key={player.username} onClick={() => openTradeWindow(player)}>
        {player.username}
      </IonButton>
    ));

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

  const sendTradeRequest = (player: PlayerInfo) => {
    socket.emit("sendTradeRequest", {
      from: currentPlayer,
      to: player,
      tradeOffer: tradeOffer,
    });
  };

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
        <h2>Select Player to Trade with:</h2>
        {playersToTradewith}
        <IonButton onClick={() => setShowTradePhaseDetails(false)}>
          Close
        </IonButton>
      </IonModal>

      {isNegotiationAccepted ? (
        <>
          <IonModal
            isOpen={showTradeWindow}
            onDidDismiss={() => setShowTradeWindow(false)}
          >
            <h1>Trade with {playerToTradeWith?.username}</h1>
            <div>Equipment Cards</div>
            {equipmentCardsToTrade?.map((card) => (
              <IonItem key={card.equipmentName}>
                <h2>{card.equipmentName}</h2>
                <IonButton>Offer</IonButton>
              </IonItem>
            ))}
            <div>Treasure Cards</div>
            {treasureCardsToTrade?.map((card) => (
              <IonItem key={card.treasureName}>
                <h2>{card.treasureName}</h2>
                <IonButton>Offer</IonButton>
              </IonItem>
            ))}
            <div>Resources</div>
            <IonItem>
              <div>
                <IonButton onClick={decrementResources}>-</IonButton>
                <span>{resourcesToTrade}</span>
                <IonButton onClick={incrementResources}>+</IonButton>
              </div>
              <IonButton>Offer</IonButton>
            </IonItem>
            <IonButton onClick={() => setShowTradeWindow(false)}>
              Close
            </IonButton>
          </IonModal>
        </>
      ) : null}
    </div>
  );
};

export default TradePhase;
