import { useState } from "react";
import { PlayerInfo } from "../Interfaces";

export interface MapPhase{
    currentPlayer: PlayerInfo | undefined;
}

const MapPhase: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Maping time</div></> );
}
 
export default MapPhase;