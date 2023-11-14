import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonInput,
  IonButton,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import {
  personAdd,
  checkmarkCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<Array<{username: string; online: boolean}>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<Array<{username: string;}>>([]);

  // Fetch friends and pending requests from the backend
  useEffect(() => {
    // Fetch friends list
    async function fetchFriends() {
      const response = await fetch('http://localhost:3000/friends/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if needed
        },
      });
      const data = await response.json();
      setFriends(data.friends);
    }
  
    // Fetch pending requests
    async function fetchPendingRequests() {
      const response = await fetch('http://localhost:3000/friends/requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if needed
        },
      });
      const data = await response.json();
      setPendingRequests(data.requests);
    }
  
    fetchFriends();
    fetchPendingRequests();
  }, []);
  

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:3000/friends/search?username=${searchTerm}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization token if needed
      },
    });
    const data = await response.json();
    // Process the search results here
  };
  

  const handleAcceptRequest = async (username: string) => {
    await fetch(`http://localhost:3000/friends/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization token if needed
      },
      body: JSON.stringify({ username }),
    });
    // Update UI accordingly
  };
  
  const handleRejectRequest = async (username: string) => {
    await fetch(`http://localhost:3000/friends/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization token if needed
      },
      body: JSON.stringify({ username }),
    });
    // Update UI accordingly
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Search Friends</IonLabel>
            <IonInput
              value={searchTerm}
              placeholder="Enter username"
              onIonChange={(e) => setSearchTerm(e.detail.value ?? '')}
            />
            <IonButton onClick={handleSearch}>Search</IonButton>
          </IonItem>
          {friends.map((friend) => (
            <IonItem key={friend.username}>
              <IonAvatar slot="start">
                {/* Replace with avatar image if available */}
                <img
                  src={`https://via.placeholder.com/150/0000FF/808080?text=${friend.username}`}
                />
              </IonAvatar>
              <IonLabel>
                {friend.username}
                <IonBadge color={friend.online ? "success" : "medium"}>
                  {friend.online ? "Online" : "Offline"}
                </IonBadge>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonTitle>Pending Friend Requests</IonTitle>
        <IonList>
          {pendingRequests.map((request) => (
            <IonItem key={request.username}>
              <IonLabel>{request.username}</IonLabel>
              <IonButton
                fill="clear"
                onClick={() => handleAcceptRequest(request.username)}
              >
                <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => handleRejectRequest(request.username)}
              >
                <IonIcon slot="icon-only" icon={closeCircleOutline} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="full" color="primary">
          <IonIcon slot="start" icon={personAdd} />
          Add New Friend
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
