import { useState } from "react";
import { PlayerInfo } from "../Interfaces";

export interface TitanPhase{
    currentPlayer: PlayerInfo | undefined;
}

const TitanPhase: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Titaning time</div></> );
}
 
export default TitanPhase;