import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { useState } from "react";

import GameBoard from "../../components/GameComponents/GameBoard/GameBoard";
import "./MultiPlayerGamePage.scss";
import { addCircleOutline, arrowForwardCircleOutline } from "ionicons/icons";
import WelcomeModal from "../../components/GameComponents/WelcomeModal";
import PlayerMenu from "../../components/GameComponents/PlayerMenu/PlayerMenu";
import GameTurnManager from "../../components/GameComponents/GameTurns/GameTurnManager";
import PlayersInGame from "../../components/GameComponents/GameBar/PlayersInGame";
import UpdateNotifications from "../../components/GameComponents/GameBar/UpdateNotification";

const MultiPlayerGamePage = () => {
  // Show Welcome Modal
  const [showModal, setShowModal] = useState<boolean>(true);

  // Player Menu
  const [isPlayerMenuOpen, setIsPlayerMenuOpen] = useState(false);

  // Open and close playermenu
  const togglePlayerMenu = () => {
    setIsPlayerMenuOpen(!isPlayerMenuOpen);
  };
  console.log("MPGP Rendered");
  return (
    <IonPage>
      {/* Welcome Modal */}
      {/* <WelcomeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      /> */}

      {/* Player Menu */}
      <PlayerMenu
        isOpen={isPlayerMenuOpen}
        onClose={() => setIsPlayerMenuOpen(false)}
      />

      <IonContent>
        {/* Floating player menu */}
        <div className="actionsMenu">
          <button className="actionsIcon" onClick={togglePlayerMenu}>
            <IonIcon icon={addCircleOutline} size="large" color="success" />
          </button>
        </div>

        {/* Title */}
        <h1 className="pageHeader">Multiplayer Game</h1>

        {/* Players in Game */}
        <PlayersInGame />

        {/* Turn Manager */}
        <GameTurnManager />

        {/* VP Count */}
        <h4 className="pageHeader">VP Counts: </h4>

        {/* GameTimers */}
        <h4 className="pageHeader">Timer: </h4>

        {/* GameBoard */}
        <div className="gameBoardContainer">
          <GameBoard />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
