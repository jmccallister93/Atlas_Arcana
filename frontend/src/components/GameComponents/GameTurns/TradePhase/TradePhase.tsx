import { useEffect, useState } from "react";
import {
  EquipmentItem,
  GameSessionInfo,
  PlayerInfo,
  TreasureItem,
} from "../../Interfaces";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { IonButton, IonModal } from "@ionic/react";
import "../../GameTurns/GameTurn.scss";
import socket from "../../../../context/SocketClient/socketClient";
import FromPlayerTrade from "./FromPlayerTrade";
import PlayersTradeWindow from "./PlayersTradeWindow";

export interface TradePhaseProps {}

const TradePhase: React.FC<TradePhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const [showTradeWindow, setShowTradeWindow] = useState(true);
  const [showTradePhaseDetails, setShowTradePhaseDetails] = useState(false);
  const [playerToTradeWith, setPlayerToTradeWith] = useState<PlayerInfo>();
  const [isNegotiationAccepted, setIsNegotiationAccepted] = useState(false);
  const [isTradeMade, setIsTradeMade] = useState(false);
  const [tradeOffer, setTradeOffer] = useState<{
    equipment: EquipmentItem[];
    treasures: TreasureItem[];
    resources: number;
  }>({
    equipment: [],
    treasures: [],
    resources: 0,
  });

  const sendTradeRequest = (player: PlayerInfo) => {
    socket.emit("sendTradeRequest", {
      fromPlayerId: currentPlayer,
      toPlayerId: player,
    });
  };


  return (
    <div className="gameturnMenuContainer">
      <IonButton onClick={() => setShowTradeWindow(true)}>
        Trade Options
      </IonButton>
      <IonModal
        isOpen={showTradeWindow}
        onDidDismiss={() => setShowTradeWindow(false)}
      >
        {gameState.players
          .filter((player) => player.username !== currentPlayer?.username)
          .map((player) => (
            <IonButton
              key={player.username}
              onClick={() => sendTradeRequest(player)}
            >
              Trade with {player.username}
            </IonButton>
          ))}
        <IonButton onClick={() => setShowTradeWindow(false)}>Close</IonButton>
      </IonModal>
      {/* <PlayersTradeWindow /> */}
    </div>
  );
};

export default TradePhase;
