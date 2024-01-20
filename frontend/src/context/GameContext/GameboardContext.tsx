// import React, { createContext, useContext, useEffect, useReducer } from "react";
// import {
//   BuildingPosition,
//   GameSessionInfo,
//   PlayerInfo,
//   PlayerPosition,
//   StrongholdPosition,
//   TitanPosition,
// } from "../../components/GameComponents/Interfaces";
// import socket from "../SocketClient/socketClient";
// import { useGameContext } from "./GameContext";

// type GameboardAction =
//   | { type: "UPDATE_PLAYER_POSITION"; payload: PlayerPosition }
//   | { type: "UPDATE_STRONGHOLD_POSITION"; payload: StrongholdPosition }
//   | { type: "UPDATE_TITAN_POSITION"; payload: TitanPosition }
//   | { type: "UPDATE_BUILDING_POSITION"; payload: BuildingPosition };

// interface GameboardState {
//   updatePlayerPosition: (updatedPlayerPosition: PlayerPosition) => void;
//   updateStrongholdPosition: (
//     updatedStrongholdPosition: StrongholdPosition
//   ) => void;
//   updateTitanPosition: (updatedTitanPosition: TitanPosition) => void;
//   updateBuildingPosition: (updatedBuildingPosition: BuildingPosition) => void;
// }

// const gameState = useGameContext()

// const initialState: GameSessionInfo = {
//  gameState: gameState
// };

// const GameboardContext = createContext<GameboardState | undefined>(undefined);

// // Helper hook to use the context
// export const useGameboardContext = () => {
//   const context = useContext(GameboardContext);
//   if (!context) {
//     throw new Error(
//       "useGameboardContext must be used within a GameboardProvider"
//     );
//   }
//   return context;
// };

// const gameboardReducer = (state: GameSessionInfo, action: GameboardAction) => {
//   switch (action.type) {
//     case "UPDATE_PLAYER_POSITION":
//       const updatedPlayerPosisitions = state.playerPositions.map((position) =>
//         position.playerUsername === action.payload.playerUsername
//           ? action.payload
//           : position
//       );
//       return { ...state, playerPositions: updatedPlayerPosisitions };
//     case "UPDATE_STRONGHOLD_POSITION":
//       let updatedStrongholdPositions = [...state.strongholdPositions];

//       const existingIndex = updatedStrongholdPositions.findIndex(
//         (pos) => pos.playerUsername === action.payload.playerUsername
//       );

//       if (existingIndex >= 0) {
//         // Update existing position
//         updatedStrongholdPositions[existingIndex] = action.payload;
//       } else {
//         // Add new position
//         updatedStrongholdPositions.push(action.payload);
//       }

//       const newState = {
//         ...state,
//         strongholdPositions: updatedStrongholdPositions,
//       };

//       return newState;

//     case "UPDATE_TITAN_POSITION":
//       const updatedTtianPosisitions = state.titanPositions.map((position) =>
//         position.titanName === action.payload.titanName
//           ? action.payload
//           : position
//       );
//       return { ...state, titanPositions: updatedTtianPosisitions };
//     case "UPDATE_BUILDING_POSITION":
//       const updatedBuildingPosisitions = state.buildingPositions.map(
//         (position) =>
//           position.buildingName === action.payload.buildingName
//             ? action.payload
//             : position
//       );
//       return { ...state, buildingPositions: updatedBuildingPosisitions };
//     default:
//       return state;
//   }
// };

// interface GameboardProviderProps {
//   children: React.ReactNode;
// }

// export const GameboardProvider: React.FC<GameboardProviderProps> = ({
//   children,
// }) => {
//   const [gameState, dispatch] = useReducer(gameboardReducer, initialState);

//   //   Player Position
//   useEffect(() => {
//     // Handler for game state updates
//     const handlePlayerPositionUpdate = (updatedState: PlayerPosition) => {
//       dispatch({ type: "UPDATE_PLAYER_POSITION", payload: updatedState });
//     };
//     // Subscribe to game state updates from the server
//     socket.on("updatePlayerPosition", handlePlayerPositionUpdate);
//     return () => {
//       socket.off("updatePlayerPosition", handlePlayerPositionUpdate);
//     };
//   }, []);

//   const emitPlayerPositionUpdate = (updatedData: Partial<GameSessionInfo>) => {
//     console.log("From emitGameState update updatedData:", updatedData);
//     if (gameState) {
//       const updatedState = {
//         sessionId: gameState.sessionId,
//         newState: {
//           ...gameState,
//           ...updatedData,
//         },
//       };
//       socket.emit("updatePlayerPosition", updatedState);
//     }
//   };

//   const updatePlayerPosition = (updatedPlayerPosition: PlayerPosition) => {
//     dispatch({
//       type: "UPDATE_PLAYER_POSITION",
//       payload: updatedPlayerPosition,
//     });
//     if (gameState && gameState.playerPositions) {
//       emitPlayerPositionUpdate({
//         playerPositions: gameState.playerPositions.map(
//           (position: PlayerPosition) =>
//             position.playerUsername === updatedPlayerPosition.playerUsername
//               ? updatedPlayerPosition
//               : position
//         ),
//       });
//     }
//   };

//   //   Stronghold psoition
//   useEffect(() => {
//     // Handler for game state updates
//     const handleStrongholdPositionUpdate = (
//       updatedState: StrongholdPosition
//     ) => {
//       dispatch({ type: "UPDATE_STRONGHOLD_POSITION", payload: updatedState });
//     };
//     // Subscribe to game state updates from the server
//     socket.on("updateStrongholdPosition", handleStrongholdPositionUpdate);
//     return () => {
//       socket.off("updateStrongholdPosition", handleStrongholdPositionUpdate);
//     };
//   }, []);

//   const emitStrongholdPositionUpdate = (
//     updatedData: Partial<GameSessionInfo>
//   ) => {
//     console.log("From emitGameState update updatedData:", updatedData);
//     if (gameState) {
//       const updatedState = {
//         sessionId: gameState.sessionId,
//         newState: {
//           ...gameState,
//           ...updatedData,
//         },
//       };
//       socket.emit("updateStrongholdPosition", updatedState);
//     }
//   };
//   const updateStrongholdPosition = (
//     updatedStrongholdPosition: StrongholdPosition
//   ) => {
//     console.log(
//       "Dispatching Stronghold Position Update:",
//       updatedStrongholdPosition
//     );
//     dispatch({
//       type: "UPDATE_STRONGHOLD_POSITION",
//       payload: updatedStrongholdPosition,
//     });
//     // Check if the stronghold position already exists
//     const positionExists = gameState.strongholdPositions.some(
//       (position: StrongholdPosition) =>
//         position.playerUsername === updatedStrongholdPosition.playerUsername
//     );

//     let updatedPositions;

//     if (positionExists) {
//       // Update the existing position
//       updatedPositions = gameState.strongholdPositions.map(
//         (position: StrongholdPosition) =>
//           position.playerUsername === updatedStrongholdPosition.playerUsername
//             ? updatedStrongholdPosition
//             : position
//       );
//     } else {
//       // Add the new position
//       updatedPositions = [
//         ...gameState.strongholdPositions,
//         updatedStrongholdPosition,
//       ];
//     }

//     console.log("Emitting Updated Stronghold Positions:", updatedPositions);
//     emitStrongholdPositionUpdate({ strongholdPositions: updatedPositions });
//   };

//   //   Titan position
//   useEffect(() => {
//     // Handler for game state updates
//     const handleTitanPositionUpdate = (updatedState: TitanPosition) => {
//       dispatch({ type: "UPDATE_TITAN_POSITION", payload: updatedState });
//     };
//     // Subscribe to game state updates from the server
//     socket.on("updateTitanPosition", handleTitanPositionUpdate);
//     return () => {
//       socket.off("updateTitanPosition", handleTitanPositionUpdate);
//     };
//   }, []);

//   const emitTitanPositionUpdate = (updatedData: Partial<GameSessionInfo>) => {
//     console.log("From emitGameState update updatedData:", updatedData);
//     if (gameState) {
//       const updatedState = {
//         sessionId: gameState.sessionId,
//         newState: {
//           ...gameState,
//           ...updatedData,
//         },
//       };
//       socket.emit("updateTitanPosition", updatedState);
//     }
//   };

//   const updateTitanPosition = (updatedTitanPosition: TitanPosition) => {
//     dispatch({ type: "UPDATE_TITAN_POSITION", payload: updatedTitanPosition });
//     if (gameState && gameState.titanPositions) {
//       emitTitanPositionUpdate({
//         titanPositions: gameState.titanPositions.map(
//           (position: TitanPosition) =>
//             position.titanName === updatedTitanPosition.titanName
//               ? updatedTitanPosition
//               : position
//         ),
//       });
//     }
//   };

//   //   Building position
//   useEffect(() => {
//     // Handler for game state updates
//     const handleBuildingPositionUpdate = (updatedState: BuildingPosition) => {
//       dispatch({ type: "UPDATE_BUILDING_POSITION", payload: updatedState });
//     };
//     // Subscribe to game state updates from the server
//     socket.on("updateBuildingPosition", handleBuildingPositionUpdate);
//     return () => {
//       socket.off("updateBuildingPosition", handleBuildingPositionUpdate);
//     };
//   }, []);

//   const emitBuildingPositionUpdate = (
//     updatedData: Partial<GameSessionInfo>
//   ) => {
//     console.log("From emitGameState update updatedData:", updatedData);
//     if (gameState) {
//       const updatedState = {
//         sessionId: gameState.sessionId,
//         newState: {
//           ...gameState,
//           ...updatedData,
//         },
//       };
//       socket.emit("updateBuildingPosition", updatedState);
//     }
//   };
//   const updateBuildingPosition = (
//     updatedBuildingPosition: BuildingPosition
//   ) => {
//     dispatch({
//       type: "UPDATE_BUILDING_POSITION",
//       payload: updatedBuildingPosition,
//     });
//     if (gameState && gameState.buildingPositions) {
//       emitBuildingPositionUpdate({
//         buildingPositions: gameState.buildingPositions.map(
//           (position: BuildingPosition) =>
//             position.ownerName === updatedBuildingPosition.ownerName
//               ? updatedBuildingPosition
//               : position
//         ),
//       });
//     }
//   };

//   console.log("From gameboard context state: ", gameState)

//   return (
//     <GameboardContext.Provider
//       value={{
//         updatePlayerPosition,
//         updateStrongholdPosition,
//         updateTitanPosition,
//         updateBuildingPosition,
//       }}
//     >
//       {children}
//     </GameboardContext.Provider>
//   );
// };
