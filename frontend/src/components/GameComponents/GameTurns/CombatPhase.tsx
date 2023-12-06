import { useState } from "react";
import { PlayerInfo } from "../Interfaces";

export interface CombatPhase{
    currentPlayer: PlayerInfo | undefined;
}

const CombatPhase: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Combating time</div></> );
}
 
export default CombatPhase;