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
import jwtDecode from "jwt-decode";

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
    Array<{ _id: string; username: string }>
  >([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { token, username } = useAuth();

  // Fetch friends and pending requests from the backend
  useEffect(() => {
    // // Fetch friends list
    // async function fetchFriends() {
    //   const headers: { [key: string]: string } = {
    //     "Content-Type": "application/json",
    //   };

    //   if (token) {
    //     headers["Authorization"] = `Bearer ${token}`;
    //   }

    //   const response = await fetch("http://localhost:3000/friends/list", {
    //     method: "GET",
    //     headers: headers,
    //   });
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   setFriends(data.friends);
    // }

    // fetchFriends();
    handleSearch();
  }, [token]);

  // Get FriendRequests
  useEffect(() => {
    async function fetchFriendRequests() {
      try {
        const response = await fetch(
          `http://localhost:3001/friends/friendRequests/${username}`
        );
        const friendRequests = await response.json();
        setPendingRequests(friendRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    }

    fetchFriendRequests();
  }, [username]);

  // Search usernames
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
      setSearchResults(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Get users by Id
  const getUserId = async () => {
    try {
      const response = await fetch("http://localhost:3001/getUserId", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      return data.userId;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Send a freind request
  const handleSendRequest = async (receiverUsername: string) => {
    const senderUsername = username;
    if (!senderUsername) {
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
          body: JSON.stringify({ senderUsername, receiverUsername }),
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

  // Accept a freind request
  const handleAcceptRequest = async (friendId: string) => {
    const userId = await getUserId();
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/friends/acceptRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, friendId }),
        }
      );

      if (response.ok) {
        // Remove the accepted request from the pending requests
        setPendingRequests((prevRequests) =>
          prevRequests.filter((req) => req.username !== friendId)
        );
      } else {
        console.error("Error accepting request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRejectRequest = async (requesterId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friends/rejectRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requesterId }),
        }
      );

      if (response.ok) {
        // Remove the rejected request from the pending requests
        setPendingRequests((prevRequests) =>
          prevRequests.filter((req) => req.username !== username)
        );
      } else {
        console.error("Error rejecting request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>Friends List</IonLabel>
        <IonList>
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
        <IonLabel>Pending Friend Requests</IonLabel>
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

        {/* Search Input Item */}
        <IonList>
          <IonItem>
            <IonLabel>Search Users:</IonLabel>
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
                <IonButton onClick={() => handleSendRequest(user.username)}>
                  Add Friend
                </IonButton>
              </IonItem>
            ))}
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
