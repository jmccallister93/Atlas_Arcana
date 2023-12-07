import { useState, useEffect } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import socket from "../../../context/SocketClient/socketClient";

export interface DrawPhaseProps {
  gameState?: GameSessionInfo;
  players: PlayerInfo[];
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  currentPlayer: PlayerInfo | undefined;
}

const DrawPhase: React.FC<DrawPhaseProps> = ({
  currentPlayer,
  emitGameStateUpdate,
  gameState,
  players,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCardDrawDetails, setShowCardDrawDetails] = useState(true);

  // Function to handle card draw
  const handleCardDraw = () => {
    if (currentPlayer && gameState) {
      // Emit drawCard event with necessary data
      socket.emit("drawCard", {
        sessionId: gameState.sessionId,
        playerId: currentPlayer,
      });
    }
  };

  useEffect(() => {
    // Listen for the cardDrawn event
    socket.on("cardDrawn", (cardDrawn) => {
      console.log("Card drawn:", cardDrawn);
      // Handle the drawn card here (e.g., update state, show modal, etc.)
    });

    // Handle any errors
    socket.on("errorDrawingCard", (errorMessage) => {
      console.error("Error drawing card:", errorMessage);
    });

    // Clean up on component unmount
    return () => {
      socket.off("cardDrawn");
      socket.off("errorDrawingCard");
    };
  }, []);

  return (
    <>
      <IonModal
        isOpen={showCardDrawDetails}
        onDidDismiss={() => setShowCardDrawDetails(false)}
      >
        <button
          className="closeButton"
          onClick={() => setShowCardDrawDetails(false)}
        >
          <IonIcon icon={closeOutline} />
        </button>
        <IonButton onClick={handleCardDraw}>Draw Card</IonButton>
        <IonButton onClick={() => setShowCardDrawDetails(false)}>
          Close
        </IonButton>
      </IonModal>
    </>
  );
};

export default DrawPhase;
