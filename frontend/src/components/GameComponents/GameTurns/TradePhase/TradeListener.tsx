import { useEffect } from "react";
import socket from "../../../../context/SocketClient/socketClient";

const TradeListener: React.FC = () => {

    useEffect(() => {
        console.log("TradeListener Rendered");
        const handleReceiveTradeRequest = (data: any) => {
            // Handle the received trade request
            // Show trade details to the player and allow them to respond
        };

        socket.on("receiveTradeRequest", handleReceiveTradeRequest);
        
        // Return a cleanup function
        return () => {
            socket.off("receiveTradeRequest", handleReceiveTradeRequest);
        };
    }, []);


    return null;
};

export default TradeListener;