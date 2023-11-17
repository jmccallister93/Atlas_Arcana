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
  IonAlert,
} from "@ionic/react";
import {
  personAdd,
  checkmarkCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";

import { useAuth } from "../../context/AuthContext/AuthContext";
import jwtDecode from "jwt-decode";
import gps from "../GlobalPageStyles.module.scss";
import socket from "../../context/SocketClient/socketClient";

interface User {
  _id: string;
  username: string;
  online?: boolean;
}

const FriendsPage: React.FC = () => {
  const [friendsList, setFriendsList] = useState<
    Array<{ _id: string; username: string; online: boolean }>
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<
    Array<{ _id: string; username: string }>
  >([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showFriendRemoveWarning, setShowFriendRemoveWarning] = useState(false);
  const [selectedFriendIdRemoval, setSelectedFriendIdRemoval] = useState<
    string | null
  >(null);
  const { _id, token, username } = useAuth();

  // Fetch friends list HTTP
  useEffect(() => {
    async function fetchFriends() {
      const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://localhost:3001/friends/friendsList",
        {
          method: "GET",
          headers: headers,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFriendsList(data.friendsList);
    }
    // Fetch list initially
    fetchFriends();

    // Setup socket listener for real-time updates
    const handleFriendsListUpdate = () => {
      console.log(
        "Received 'updateFriendsList' event from server. Fetching new friends list..."
      );
      fetchFriends();
    };

    socket.on("updateFriendsList", handleFriendsListUpdate);

    // Cleanup
    return () => {
      socket.off("updateFriendsList", handleFriendsListUpdate);
    };
  }, [socket, token]);

  // Initial search after freinds list loads
  useEffect(() => {
    handleSearch();
  }, [friendsList]);

  // Refactored fetchFriendRequests function
  const fetchFriendRequests = async () => {
    if (username) {
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
  };

  // useEffect for initial fetch and real-time updates
  useEffect(() => {
    fetchFriendRequests(); // Fetch friend requests initially

    const handleFriendRequestsUpdate = () => {
      console.log(
        "Received 'updatePendingRequests' event from server. Fetching new data..."
      );
      fetchFriendRequests(); // Fetch updated friend requests
    };

    socket.on("updatePendingRequests", handleFriendRequestsUpdate);

    // Cleanup
    return () => {
      socket.off("updatePendingRequests", handleFriendRequestsUpdate);
    };
  }, [username, socket]); // include other dependencies if necessary

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
      // let data = await response.json();
      // const friendIds = friendsList.map(friend => friend.username); // Assuming friend object has _id field
      // data = data.filter(user: string => !friendIds.includes(user.username));
      // setSearchResults(data);
      const data: User[] = await response.json();
      // Filter out friends from the search results
      const friendUsernames = friendsList.map((friend) => friend.username); // Assuming each friend object has a username field
      const filteredData = data.filter(
        (user) => !friendUsernames.includes(user.username)
      );

      setSearchResults(filteredData);
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
    socket.emit("sendFriendRequest", { senderId, receiverId });
  };

  // Listening for a response event from the server
  useEffect(() => {
    socket.on("friendRequestSent", (data) => {
      // Handle the response, like updating UI
      console.log("Friend request sent:", data);
    });

    // Corrected cleanup function
    return () => {
      socket.off("friendRequestSent");
    };
  }, []);

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
    socket.emit("acceptFriendRequest", { userId, friendId });
  };

  // reject freind request
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

  // Remove friend
  const handleRemoveFriendRequest = async (friendId: string | null) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friends/removeFriend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ friendId }),
        }
      );

      if (response.ok) {
        // Remove the friend from the local state to update UI
        setFriendsList((prevList) =>
          prevList.filter((friend) => friend._id !== friendId)
        );
      } else {
        console.error("Error removing friend");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Removal Popup warning
  const handleRemoveFriend = (friendId: string) => {
    setSelectedFriendIdRemoval(friendId);
    setShowFriendRemoveWarning(true);
  };

  const confirmRemoveFriend = async () => {
    handleRemoveFriendRequest(selectedFriendIdRemoval);
    setSelectedFriendIdRemoval(null);
    setShowFriendRemoveWarning(false);
  };

  const cancelRemoveFriend = () => {
    setSelectedFriendIdRemoval(null);
    setShowFriendRemoveWarning(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={gps.topMargin}></div>
        <IonLabel>Friends List</IonLabel>

        {friendsList?.length <= 0 ? (
          <IonList>
            <IonItem>
              <IonLabel>Add some friends!</IonLabel>
            </IonItem>
          </IonList>
        ) : (
          <IonList>
            {friendsList.map((friend) => (
              <IonItem key={friend._id}>
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
                <IonButton
                  fill="clear"
                  onClick={() => handleRemoveFriend(friend._id)}
                >
                  Remove
                  <IonIcon slot="icon-only" icon={closeCircleOutline} />
                </IonButton>
              </IonItem>
            ))}{" "}
          </IonList>
        )}
        {/* Friend removal warning */}
        <IonAlert
          isOpen={showFriendRemoveWarning}
          onDidDismiss={() => setShowFriendRemoveWarning(false)}
          header={"Confirm Removal"}
          message={"Are you sure you want to remove this friend?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: cancelRemoveFriend,
            },
            {
              text: "Yes, Remove",
              handler: confirmRemoveFriend,
            },
          ]}
        />

        {/* Pending Friend Requests */}
        {pendingRequests?.length <= 0 ? null : (
          <>
            <IonLabel>Pending Friend Requests</IonLabel>
            <IonList>
              {pendingRequests.map((request) => (
                <IonItem key={request.username}>
                  <IonLabel>{request.username}</IonLabel>
                  <IonButton
                    fill="clear"
                    onClick={() => handleAcceptRequest(request._id)}
                  >
                    <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => handleRejectRequest(request._id)}
                  >
                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        {/* Search Input Item */}
        <IonLabel>Search Friends</IonLabel>
        <IonList>
          <IonItem>
            <IonLabel>Search Usernames:</IonLabel>
            <IonInput
              value={searchTerm}
              placeholder="Enter username"
              onIonInput={(e) => setSearchTerm(e.detail.value ?? "")}
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
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
