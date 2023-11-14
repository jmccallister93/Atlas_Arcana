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

import { useAuth } from "../../context/AuthContext/AuthContext";
import jwtDecode from 'jwt-decode';

interface User {
  _id: string;
  username: string;
}

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<
    Array<{ username: string; online: boolean }>
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<
    Array<{ username: string }>
  >([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { token } = useAuth();

  if (!token) {
    return <div>Loading...</div>; // Or any other loading indicator
  }


  // Fetch friends and pending requests from the backend
  useEffect(() => {
    console.log("Token available:", !!token); 
    // Fetch friends list
    async function fetchFriends() {
      const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:3000/friends/list", {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      setFriends(data.friends);
    }

    // Fetch pending requests
    async function fetchPendingRequests() {
      const response = await fetch("http://localhost:3000/friends/requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Include authorization token if needed
        },
      });
      const data = await response.json();
      setPendingRequests(data.requests);
    }

    fetchFriends();
    fetchPendingRequests();
  }, [token]);

  const handleSearch = async () => {

    try {
      const response = await fetch(
        `http://localhost:3001/friends/search?username=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // assuming you have the token variable set up as before
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSearchResults(data); // store the search results
      // Process the search results here
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle errors here, such as showing an error message to the user
    }
  };

  const getUserId = async () => {
    console.log("Token before getUserId fetch:", token);
    try {
      const response = await fetch("http://localhost:3001/getUserId", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response from getUserId:", response);
      const data = await response.json();
      return data.userId;
    } catch (error) {
      console.error("Error:", error);
    }
  
  };

  const handleSendRequest = async (receiverId: string) => {
    const senderId = await getUserId();
    if (!senderId) {
      console.error("Sender ID not found");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3001/friends/sendRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ senderId, receiverId }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Error sending friend request");
      }

      // Handle successful request, like updating UI or state
    } catch (error) {
      console.error("Error:", error);
      // Handle error, such as showing an error message
    }
  };

  const handleAcceptRequest = async (username: string) => {
    await fetch(`http://localhost:3001/friends/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authorization token if needed
      },
      body: JSON.stringify({ username }),
    });
    // Update UI accordingly
  };

  const handleRejectRequest = async (username: string) => {
    await fetch(`http://localhost:3000/friends/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          {/* Search Input Item */}
          <IonItem>
            <IonLabel>Search Friends</IonLabel>
            <IonInput
              value={searchTerm}
              placeholder="Enter username"
              onIonChange={(e) => setSearchTerm(e.detail.value ?? "")}
            />
            <IonButton onClick={handleSearch}>Search</IonButton>
          </IonItem>

          {/* Search Results */}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {searchResults.map((user) => (
              <IonItem key={user._id}>
                <IonLabel>{user.username}</IonLabel>
                <IonButton onClick={() => handleSendRequest(user._id)}>
                  Add Friend
                </IonButton>
              </IonItem>
            ))}
          </div>
          {/* Existing Friends */}
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

        {/* Pending Friend Requests */}
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
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
