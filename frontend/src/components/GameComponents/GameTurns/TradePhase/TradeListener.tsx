import React, { useState, useEffect } from "react";
import socket from "../../../../context/SocketClient/socketClient";
import { IonButton, IonModal } from "@ionic/react";
import { PlayerInfo } from "../../Interfaces";
import PlayersTradeWindow from "./PlayersTradeWindow";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";

const TradeListener: React.FC = () => {
  const [incomingTradeRequest, setIncomingTradeRequest] =
    useState<boolean>(false);
  const [fromPlayerId, setFromPlayerId] = useState<PlayerInfo>();
  const [toPlayerId, setToPlayerId] = useState<PlayerInfo>();
  const [showIncomingTradeRequest, setShowIncomingTradeRequest] =
    useState<boolean>(false);

  const [showActiveTradeWindow, setShowActiveTradeWindow] = useState(false);
  const [tradePartnerId, setTradePartnerId] = useState<PlayerInfo>();
  const { gameState } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );

  useEffect(() => {
    const handleReceiveTradeRequest = (data: any) => {
      console.log("Received trade request:", data);
      setFromPlayerId(data.fromPlayerId);
      setIncomingTradeRequest(true);
      setShowIncomingTradeRequest(true);
    };

    socket.on("receiveTradeRequest", handleReceiveTradeRequest);

    return () => {
      socket.off("receiveTradeRequest", handleReceiveTradeRequest);
    };
  }, []);

  const acceptTrade = () => {
    // Handle trade acceptance logic
    console.log("Trade accepted");
    // You can emit an event to the server here
    socket.emit("respondToTradeRequest", {
      response: "accepted",
      fromPlayerId,
      toPlayerId: currentPlayer,
    });
    setToPlayerId(currentPlayer);
    setIncomingTradeRequest(false); // Reset trade request
  };

  const declineTrade = () => {
    // Handle trade decline logic
    console.log("Trade declined");
    // You can emit an event to the server here
    socket.emit("respondToTradeRequest", { response: "declined" });
    setIncomingTradeRequest(false); // Reset trade request
  };

  useEffect(() => {
    const handleOpenTradeWindow = (data: any) => {
      console.log("Opening trade window with:", data.otherPlayerId);
      setTradePartnerId(data.otherPlayerId);
      setShowActiveTradeWindow(true);
    };

    socket.on("openTradeWindow", handleOpenTradeWindow);

    return () => {
      socket.off("openTradeWindow", handleOpenTradeWindow);
    };
  }, []);

  return (
    <>
      <IonModal
        isOpen={showIncomingTradeRequest}
        onDidDismiss={() => setShowIncomingTradeRequest(false)}
      >
        <p>Trade Request from {fromPlayerId?.username}</p>
        {/* Display trade details here */}
        <IonButton onClick={acceptTrade}>Accept</IonButton>
        <IonButton onClick={declineTrade}>Decline</IonButton>
        <IonButton onClick={() => setShowIncomingTradeRequest(false)}>
          Close
        </IonButton>
      </IonModal>
      <IonModal
        isOpen={showActiveTradeWindow}
        onDidDismiss={() => setShowActiveTradeWindow(false)}
      >
        <PlayersTradeWindow
         tradePartnerId={tradePartnerId}
        />
      </IonModal>
    </>
  );
};

export default TradeListener;
