import React, { useState, useEffect } from 'react';
import socket from '../../../../context/SocketClient/socketClient';
import { IonButton, IonModal } from '@ionic/react';
import { PlayerInfo } from '../../Interfaces';

const TradeListener: React.FC = () => {
    const [incomingTradeRequest, setIncomingTradeRequest] = useState<boolean>(false);
    const [fromPlayerId, setFromPlayerId] = useState<PlayerInfo>();
    const [showIncomingTradeRequest, setShowIncomingTradeRequest] = useState<boolean>(false);

    useEffect(() => {
        const handleReceiveTradeRequest = (data: any) => {
            console.log("Received trade request:", data);
            setFromPlayerId(data.fromPlayerId);
            setIncomingTradeRequest(true);
            setShowIncomingTradeRequest(true);
        };

        socket.on("receiveTradeRequest", handleReceiveTradeRequest);
        
        return () => {
            socket.off("receiveTradeRequest", handleReceiveTradeRequest);
        };
    }, []);

    const acceptTrade = () => {
        // Handle trade acceptance logic
        console.log('Trade accepted');
        // You can emit an event to the server here
        socket.emit('respondToTradeRequest', { response: 'accepted' });
        setIncomingTradeRequest(false); // Reset trade request
    };

    const declineTrade = () => {
        // Handle trade decline logic
        console.log('Trade declined');
        // You can emit an event to the server here
        socket.emit('respondToTradeRequest', { response: 'declined' });
        setIncomingTradeRequest(false); // Reset trade request
    };

    if (!incomingTradeRequest) {
        return null; // No trade request to display
    }

    return (
        <IonModal
            isOpen={showIncomingTradeRequest}
            onDidDismiss={() => setShowIncomingTradeRequest(false)}
        >
            <p>Trade Request from {fromPlayerId?.username}</p>
            {/* Display trade details here */}
            <IonButton onClick={acceptTrade}>Accept</IonButton>
            <IonButton onClick={declineTrade}>Decline</IonButton>
            <IonButton onClick={() => setShowIncomingTradeRequest(false)}>Close</IonButton>
        </IonModal>
    );
};

export default TradeListener;
