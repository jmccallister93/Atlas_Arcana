import { useState } from "react";
import { PlayerInfo } from "../Interfaces";

export interface DrawPhase{
    currentPlayer: PlayerInfo | undefined;
}

const DrawPhase: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's drawing time</div></> );
}
 
export default DrawPhase;