import { useState } from "react";
import { PlayerInfo } from "../Interfaces";

export interface RestPhase{
    currentPlayer: PlayerInfo | undefined;
}

const RestPhase: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Resting time</div></> );
}
 
export default RestPhase;