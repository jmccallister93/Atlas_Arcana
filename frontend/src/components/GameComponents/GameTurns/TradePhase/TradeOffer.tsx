import { useEffect, useState } from "react";
import socket from "../../../../context/SocketClient/socketClient";
import { IonItem } from "@ionic/react";
import { EquipmentItem, TreasureItem } from "../../Interfaces";

const TradeOffer:React.FC = () => {
    interface TradeOffer {
        equipment: EquipmentItem[];
        treasures: TreasureItem[];
        resources: number;
      }
    interface TradeState {
        firstPlayerOffer: TradeOffer;
        secondPlayerOffer: TradeOffer;
      }
    
      const [tradeState, setTradeState] = useState<TradeState>({
        firstPlayerOffer: {
          equipment: [],
          treasures: [],
          resources: 0,
        },
        secondPlayerOffer: {
          equipment: [],
          treasures: [],
          resources: 0,
        },
      });
    const [tradeDisplayPlayer, setTradeDisplayPlayer] = useState<string>();
    const [tradeDisplayOffer, setTradeDisplayOffer] = useState<{}>();

    useEffect(() => {
        socket.on("tradeAdded", (data: any) => {
          console.log("Trade added:", data);
          setTradeDisplayPlayer(data.playerId)
          setTradeDisplayOffer(data.tradeState)
        });
        return () => {
          socket.off("tradeAdded");
        };
      }, []);
    return (
        <>
        <IonItem>
            {/* {tradeState[
                currentPlayer?.username === auth.username
                  ? "secondPlayerOffer"
                  : "firstPlayerOffer"
              ].equipment.map((item) => (
                <li key={item.equipmentName}>{item.equipmentName}</li>
              ))} */}
        
            </IonItem>
        </>
    );
}

export default TradeOffer;