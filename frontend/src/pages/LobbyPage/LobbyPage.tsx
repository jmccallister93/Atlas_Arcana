import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useEffect, useState } from "react";
import socket from "../../context/SocketClient/socketClient";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from "react-router-dom";

interface GameSessionInfo {
  // Define the properties of gameSessionInfo
  // For instance:
  playerId: string;
  opponentId: string;
  // Add other relevant properties
}
interface LeftMatchmakingResponse {
  success: boolean;
}

const LobbyPage = () => {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [searchingForGame, setSearchingForGame] = useState<boolean>(false);
  const [gameSize, setGameSize] = useState<number>(2);
  const [amountOfPlayers, setAmountOfPlayers] = useState<number>(2);
  const [amountOfPlayerOptions, setAmountOfPlayerOptions] = useState<number[]>(
    []
  );
  const [amountOfNpcs, setAmountOfNpcs] = useState<number>(0);
  const [amountOfNpcOptions, setAmountOfNpcOptions] = useState<number[]>([]);
  const { token, isLoggedIn } = useAuth();
  const history = useHistory();

  // Handle online user count
  useEffect(() => {
    // Existing socket setup
    const handleUpdateOnlineUsers = (usersCount: number) => {
      // console.log("Received users count from server:", usersCount);
      setOnlineUsers(usersCount);
    };

    // console.log("Setting up event listener for updateOnlineUsers");
    socket.on("updateOnlineUsers", handleUpdateOnlineUsers);

    return () => {
      // console.log("Cleaning up event listener for updateOnlineUsers");
      socket.off("updateOnlineUsers", handleUpdateOnlineUsers);
    };
  }, []);

  // Join matchmaking
  const joinMatchmaking = async () => {
    setSearchingForGame(true);
    try {
      console.log("Attempting to join matchmaking queue", { userId: token });
      socket.emit("joinMatchmaking", { userId: token });
    } catch (error) {
      console.error("Error joining matchmaking:", error);
    }
  };
  // Function to handle leaving the matchmaking queue
  const leaveMatchmaking = () => {
    setSearchingForGame(false);
    console.log("Leaving matchmaking queue", { userId: token });
    socket.emit("leaveMatchmaking", { userId: token }); // Emit an event to leave the queue
  };

  // handle left matchmaking update
  useEffect(() => {
    const handleLeftMatchmaking = (data: LeftMatchmakingResponse) => {
      if (data.success) {
        setSearchingForGame(false);
        console.log("Successfully left the matchmaking queue");
      }
    };

    socket.on("leftMatchmaking", handleLeftMatchmaking);

    return () => {
      socket.off("leftMatchmaking", handleLeftMatchmaking);
    };
  }, []);

  // Register player with socketio
  useEffect(() => {
    if (isLoggedIn && token) {
      socket.emit("registerPlayer", token);
    }
  }, [isLoggedIn, token]);
  // Handle match found event
  useEffect(() => {
    const handleMatchFound = (gameSessionInfo: GameSessionInfo) => {
      console.log("Match found! Game session info:", gameSessionInfo);
      setSearchingForGame(false); // Update state to stop showing 'searching for game'

      // // Show popup message here
      // alert("Match Found! Joining Game...");

      // Redirect after a 5-second delay
      setTimeout(() => {
        history.push("/game", { gameSession: gameSessionInfo });
      }, 5000);
    };

    socket.on("matchFound", handleMatchFound);

    return () => {
      socket.off("matchFound", handleMatchFound);
    };
  }, [history, socket]); // Add history to the dependency array

  // Handler for game size change
  const handleGameSizeChange = (event: any) => {
    const newGameSize = parseInt(event.detail.value, 10);
    setGameSize(newGameSize);
    setAmountOfPlayers(Math.min(amountOfPlayers, newGameSize));
    setAmountOfNpcs(Math.max(0, newGameSize - amountOfPlayers));
  };

  // Recalculate options for players and NPCs based on the game size
  useEffect(() => {
    const newPlayerOptions = Array.from({ length: gameSize }, (_, i) => i + 1);
    const newNpcOptions = Array.from({ length: gameSize - 1 }, (_, i) => i);

    // Update player and NPC options
    setAmountOfPlayerOptions(newPlayerOptions);
    setAmountOfNpcOptions(newNpcOptions);
  }, [gameSize]);

  // Handle changes in player count
  const handlePlayerCountChange = (event: any) => {
    const selectedPlayerCount = parseInt(event.detail.value, 10);
    setAmountOfPlayers(selectedPlayerCount);
    setAmountOfNpcs(gameSize - selectedPlayerCount);
  };

  // Handle changes in NPC count
  const handleNpcCountChange = (event: any) => {
    const selectedNpcCount = parseInt(event.detail.value, 10);
    setAmountOfNpcs(selectedNpcCount);
    setAmountOfPlayers(gameSize - selectedNpcCount);
  };

  return (
    <IonPage>
      {isLoggedIn ? (
        <IonContent fullscreen={true} className="ion-padding">
          <div className={gps.topMargin}></div>
          <h1>Game Lobby</h1>
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-md="6">
                {/* CALL ON SINGLEPLAYER FROM HERE SEPERATE COMPONENET, START GAME */}
                <IonCard button={true} routerLink="/singleplayer">
                  <IonCardHeader>
                    <IonCardTitle>Single Player Game</IonCardTitle>
                    <IonCardSubtitle>Play solo</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Challenge yourself in a single player game.
                    <div style={{ textAlign: "center" }}>
                      <IonButton >
                        Start Game
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* CALL ON MULTIPLAYER QUE FROM HERE SEPERATE COMPONENET */}
              <IonCol size="12" size-md="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Multiplayer Game</IonCardTitle>
                    <IonCardSubtitle>Join a multiplayer battle</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Dive into intense multiplayer action.
                    <IonList>
                      <IonItem>
                        <IonSelect
                          value={gameSize}
                          onIonChange={handleGameSizeChange}
                          label="Game Size"
                          labelPlacement="floating"
                        >
                          <IonSelectOption value={2}>2</IonSelectOption>
                          <IonSelectOption value={3}>3</IonSelectOption>
                          <IonSelectOption value={4}>4</IonSelectOption>
                          <IonSelectOption value={5}>5</IonSelectOption>
                          <IonSelectOption value={6}>6</IonSelectOption>
                          <IonSelectOption value={7}>7</IonSelectOption>
                          <IonSelectOption value={8}>8</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonList>
                    {/* Player Options */}
                    <IonList>
                      <IonItem>
                        <IonSelect
                          value={amountOfPlayers}
                          onIonChange={handlePlayerCountChange}
                          label="Number of Players"
                          labelPlacement="floating"
                        >
                          {amountOfPlayerOptions.map((option) => (
                            <IonSelectOption key={option} value={option}>
                              {option}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonList>
                    {/* NPC Options */}
                    <IonList>
                      <IonItem>
                        <IonSelect
                          value={amountOfNpcs}
                          onIonChange={handleNpcCountChange}
                          label="Number of NPC's"
                          labelPlacement="floating"
                        >
                          {amountOfNpcOptions.map((option) => (
                            <IonSelectOption key={option} value={option}>
                              {option}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonList>
                  </IonCardContent>

                  {searchingForGame ? (
                    <div style={{ textAlign: "center" }}>
                      <IonSpinner name="crescent" />
                      <p>Searching for game...</p>
                      <IonButton onClick={leaveMatchmaking} color="danger">
                        Leave Que
                      </IonButton>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <IonButton onClick={joinMatchmaking}>
                        Start Search
                      </IonButton>
                    </div>
                  )}
                </IonCard>
              </IonCol>

              <IonCol size="12" size-md="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Players Online</IonCardTitle>
                    <IonCardSubtitle>Current online players</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {onlineUsers} players are currently online.
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Add additional tiles here */}
            </IonRow>
          </IonGrid>
        </IonContent>
      ) : (
        <IonContent>
          <div className={gps.topMargin}></div>
          <IonCard button routerLink="/login">
            <IonCardHeader>
              <IonCardTitle>Please Login to continue to Dashboard</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </IonContent>
      )}
    </IonPage>
  );
};

export default LobbyPage;
