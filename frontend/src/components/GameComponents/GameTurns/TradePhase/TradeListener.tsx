import React, { useState, useEffect, ReactElement } from "react";
import socket from "../../../../context/SocketClient/socketClient";
import { IonAlert, IonButton, IonIcon, IonModal } from "@ionic/react";
import { PlayerInfo } from "../../Interfaces";
import PlayersTradeWindow from "./PlayersTradeWindow";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { closeOutline } from "ionicons/icons";
import "../GameTurn.scss";

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

  const [
    isTradeRequestDeclinedAlertVisible,
    setIsTradeRequestDeclinedAlertVisible,
  ] = useState<boolean>(false);
  const [
    isTradeRequestCompleteAlertVisible,
    setIsTradeRequestCompleteAlertVisible,
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

  const onCloseRequest = () => {
    setShowIncomingTradeRequest(false)
    declineTrade()
  }

  useEffect(() => {
    const handleCloseByOther = (data: any) => {
      if (data.closedByPlayerId !== currentPlayer?.username) {
        setShowActiveTradeWindow(false);
      }
    };
  
    socket.on("tradeWindowClosedByOther", handleCloseByOther);
  
    return () => {
      socket.off("tradeWindowClosedByOther", handleCloseByOther);
    };
  }, [currentPlayer]);

  return (
    <>
      <div className="gameturnMenuContainer">
        <IonModal
          isOpen={showIncomingTradeRequest}
          onDidDismiss={() => setShowIncomingTradeRequest(false)}
        >
          <div className="modalHeader">
            <h3>Incoming Trade Request from {fromPlayerId?.username}</h3>
            <button
              className="closeButton"
              onClick={onCloseRequest}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>
          {/* Display trade details here */}
          <IonButton onClick={acceptTrade}>Accept</IonButton>
          <IonButton onClick={declineTrade}>Decline</IonButton>
          <IonButton onClick={() => setShowIncomingTradeRequest(false)}>
            Close
          </IonButton>
        </IonModal>
      </div>
      <IonModal
        isOpen={showActiveTradeWindow}
        onDidDismiss={() => setShowActiveTradeWindow(false)}
      >
        <PlayersTradeWindow
          tradePartnerId={tradePartnerId}
          tradeSessionId={tradeSessionId}
          onClose={() => setShowActiveTradeWindow(false)}
          declineTrade={declineTrade}
          setShowActiveTradeWindow = {setShowActiveTradeWindow}
          setIsTradeRequestCompleteAlertVisible= {setIsTradeRequestCompleteAlertVisible}
          setShowIncomingTradeRequest = {setShowIncomingTradeRequest}
        />
      </IonModal>

      <IonAlert
        isOpen={isTradeRequestDeclinedAlertVisible}
        onDidDismiss={() => setIsTradeRequestDeclinedAlertVisible(false)}
        header={"Trade Declined"}
        message={"The trade request has been declined."}
        buttons={["OK"]}
      />
      <IonAlert
        isOpen={isTradeRequestCompleteAlertVisible}
        onDidDismiss={() => setIsTradeRequestCompleteAlertVisible(false)}
        header={"Trade Completed"}
        message={"The trade request has been completed."}
        buttons={["OK"]}
      />
    </>
  );
};

export default TradeListener;
