import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

export interface MapPhaseProps{
    gameState?: GameSessionInfo;
    players: PlayerInfo[];
    emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
    currentPlayer: PlayerInfo | undefined;
}

const MapPhase: React.FC<MapPhaseProps> = ({
    currentPlayer,
    emitGameStateUpdate,
    gameState,
    players,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Maping time</div></> );
}
 
export default MapPhase;