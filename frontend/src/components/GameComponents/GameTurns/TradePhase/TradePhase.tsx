import { useEffect, useState } from "react";
import {
  EquipmentItem,
  GameSessionInfo,
  PlayerInfo,
  TreasureItem,
} from "../../Interfaces";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import "../../GameTurns/GameTurn.scss";
import socket from "../../../../context/SocketClient/socketClient";
import { closeOutline } from "ionicons/icons";

export interface TradePhaseProps {}

const TradePhase: React.FC<TradePhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const [showTradeWindow, setShowTradeWindow] = useState(true);

  const sendTradeRequest = (player: PlayerInfo) => {
    socket.emit("sendTradeRequest", {
      fromPlayerId: currentPlayer,
      toPlayerId: player,
    });
  };

  return (
    <>
      <IonButton onClick={() => setShowTradeWindow(true)}>
        Trade Options
      </IonButton>
      <div className="gameturnMenuContainer">
        <IonModal
          isOpen={showTradeWindow}
          onDidDismiss={() => setShowTradeWindow(false)}
        >
          <div className="modalHeader">
            <h2>Trade Options</h2>
            <button
              className="closeButton"
              onClick={() => setShowTradeWindow(false)}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>
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
      </div>
    
    </>
  );
};

export default TradePhase;
