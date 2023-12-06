import { useState } from "react";
import { PlayerInfo } from "../Interfaces";

export interface TradePhase{
    currentPlayer: PlayerInfo | undefined;
}

const TradePhase: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    return ( <>
    <div>  It's Tradeing time</div></> );
}
 
export default TradePhase;