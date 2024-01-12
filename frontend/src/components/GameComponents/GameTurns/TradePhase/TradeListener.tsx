import React, { useState, useEffect, ReactElement } from "react";
import socket from "../../../../context/SocketClient/socketClient";
import { IonAlert, IonButton, IonModal } from "@ionic/react";
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
  const [tradeSessionId, setTradeSessionId] = useState<string>();
  const [tradeRequestDeclined, setTradeRequestDeclined] =
    useState<boolean>(false);
  const [tradeRequestDeclinedAlert, setTradeRequestDeclinedAlert] =
    useState<ReactElement>();
  const [
    isTradeRequestDeclinedAlertVisible,
    setIsTradeRequestDeclinedAlertVisible,
  ] = useState<boolean>(false);

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
    // You can emit an event to the server here
    socket.emit("respondToTradeRequest", {
      response: "declined",
      fromPlayerId,
      toPlayerId: currentPlayer,
    });
    setIncomingTradeRequest(false); // Reset trade request
    setShowIncomingTradeRequest(false);
  };

  useEffect(() => {
    socket.on("tradeRequestDeclined", (data) => {
      setTradeRequestDeclined(true);
      setIsTradeRequestDeclinedAlertVisible(true);
    });
    return () => {
      socket.off("tradeRequestDeclined");
    };
  }, []);

  useEffect(() => {
    const handleOpenTradeWindow = (data: any) => {
      console.log("Opening trade window with:", data.otherPlayerId);
      setTradePartnerId(data.otherPlayerId);
      setTradeSessionId(data.tradeSessionId);
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
          tradeRequestDeclined={tradeRequestDeclined}
          tradePartnerId={tradePartnerId}
          tradeSessionId={tradeSessionId}
        />
      </IonModal>

      <IonAlert
        isOpen={isTradeRequestDeclinedAlertVisible}
        onDidDismiss={() => setIsTradeRequestDeclinedAlertVisible(false)}
        header={"Trade Declined"}
        message={"The trade request has been declined."}
        buttons={["OK"]}
      />
    </>
  );
};

export default TradeListener;
