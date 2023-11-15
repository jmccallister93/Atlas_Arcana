import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Adjust the URL to match your server/

socket.on("connect", () => {});
socket.on("updateOnlineUsers", (usersCount) => {});

// Matchmaking found
socket.on("matchFound", (matchDetails) => {
    console.log("Match found:", matchDetails);
    const event = new CustomEvent("match-found", { detail: matchDetails });
    window.dispatchEvent(event);
  });

export default socket;
