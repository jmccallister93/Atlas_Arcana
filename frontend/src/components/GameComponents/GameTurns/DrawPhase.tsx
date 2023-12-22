import { useState, useEffect } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import socket from "../../../context/SocketClient/socketClient";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import "./GameTurn.scss"

export interface DrawPhaseProps {}

const DrawPhase: React.FC<DrawPhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
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
      
      if(currentPlayer){
        const newPlayer = {
          ...currentPlayer,
          inventory: {
            ...currentPlayer.inventory,
            equipment: [...currentPlayer.inventory.equipment, cardDrawn],
          },
        };
        updatePlayerData(newPlayer);
      }
     

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
    <div className="gameturnMenuContainer">
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
    </div>
  );
};

export default DrawPhase;
