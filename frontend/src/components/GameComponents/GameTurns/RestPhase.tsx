import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

export interface RestPhaseProps{
    gameState?: GameSessionInfo;
    players: PlayerInfo[];
    emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
    currentPlayer: PlayerInfo | undefined;
}

const RestPhase: React.FC<RestPhaseProps> = ({
    currentPlayer,
    emitGameStateUpdate,
    gameState,
    players,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Resting time</div></> );
}
 
export default RestPhase;