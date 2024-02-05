import { useState, useEffect } from "react";
import { EquipmentItem, GameSessionInfo, PlayerInfo } from "../../Interfaces";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import socket from "../../../../context/SocketClient/socketClient";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import "../GameTurn.scss";

export interface DrawPhaseProps {}

const DrawPhase: React.FC<DrawPhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const [showCardDrawDetails, setShowCardDrawDetails] = useState(true);
  const [isEquipmentCardDrawn, setIsEquipmentCardDrawn] = useState(false);
  const [equipmentCardDetails, setEquipmentCardDetails] =
    useState<EquipmentItem>();
  const [resourcesAllocatedDetails, setResourcesAllocatedDetails] =
    useState<any>();
  const [isResourcesAllocated, setIsResourcesAllocated] = useState(false);

  // Function to handle card draw
  const handleEquipmentCardDraw = () => {
    if (currentPlayer && gameState) {
      // Emit drawCard event with necessary data
      socket.emit("drawEquipmentCard", {
        sessionId: gameState.sessionId,
        playerId: currentPlayer,
      });
    }
    setIsEquipmentCardDrawn(true);
  };

  // Listen for cardDrawn event
  useEffect(() => {
    // Listen for the cardDrawn event
    socket.on("equipmentCardDrawn", (cardDrawn) => {
      console.log("Card drawn:", cardDrawn);
      setEquipmentCardDetails(cardDrawn);
      if (currentPlayer) {
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
      socket.off("equipmentCardDrawn");
      socket.off("errorDrawingCard");
    };
  }, []);

  // Listen for allocate resources event
  useEffect(() => {
    socket.on("resourcesAllocated", (resourcesAllocated) => {
      console.log("resourcesAllocated", resourcesAllocated);
      setResourcesAllocatedDetails(
        resourcesAllocated - currentPlayer?.inventory.resources
      );
      if (currentPlayer) {
        const newPlayer = {
          ...currentPlayer,
          inventory: {
            ...currentPlayer.inventory,
            resources: currentPlayer.inventory.resources + resourcesAllocated,
          },
        };
        updatePlayerData(newPlayer);
      }
    });

    // Handle any errors
    socket.on("errorAllocatingResources", (errorMessage) => {
      console.error("errorAllocatingResources:", errorMessage);
    });

    // Clean up on component unmount
    return () => {
      socket.off("resourcesAllocated");
      socket.off("errorAllocatingResources");
    };
  }, []);

  // Emit allocateResources event
  const handleDrawResources = () => {
    if (currentPlayer && gameState) {
      socket.emit("allocateResources", {
        sessionId: gameState.sessionId,
        player: currentPlayer,
      });
    }
    setIsResourcesAllocated(true);
  };

  return (
    <div className="gameturnMenuContainer">
      <IonButton onClick={() => setShowCardDrawDetails(true)}>
        Draw Options
      </IonButton>

      <IonModal
        isOpen={showCardDrawDetails}
        onDidDismiss={() => setShowCardDrawDetails(false)}
      >
        <div className="modalHeader">
          <h3>Draw Phase</h3>
          <button
            className="closeButton"
            onClick={() => setShowCardDrawDetails(false)}
          >
            <IonIcon icon={closeOutline} />
          </button>
        </div>
        {isResourcesAllocated ? (
          <>
            <h2>Resources Allocated! {resourcesAllocatedDetails}</h2>
          </>
        ) : (
          <>
            {" "}
            <IonButton onClick={handleDrawResources}>
              Allocate Resources
            </IonButton>{" "}
          </>
        )}

        {isEquipmentCardDrawn ? (
          <>
            <h2>Equipment Card Drawn!</h2>
            {equipmentCardDetails && (
              <>
                <p>
                  <strong>Name:</strong> {equipmentCardDetails.equipmentName}
                </p>
                <p>
                  <strong>Slot:</strong> {equipmentCardDetails.slot}
                </p>
                <p>
                  <strong>Set:</strong> {equipmentCardDetails.set}
                </p>
                <p>
                  <strong>Rank:</strong> {equipmentCardDetails.rank}
                </p>
                <p>
                  <strong>Element:</strong> {equipmentCardDetails.element}
                </p>
                <p>
                  <strong>Bonus:</strong> {equipmentCardDetails.bonus}
                </p>
              </>
            )}
            <IonButton onClick={() => setShowCardDrawDetails(false)}>
              Close
            </IonButton>
          </>
        ) : (
          <>
            {" "}
            <IonButton onClick={handleEquipmentCardDraw}>
              Draw Card
            </IonButton>{" "}
            <IonButton onClick={() => setShowCardDrawDetails(false)}>
              Close
            </IonButton>
          </>
        )}
      </IonModal>
    </div>
  );
};

export default DrawPhase;
