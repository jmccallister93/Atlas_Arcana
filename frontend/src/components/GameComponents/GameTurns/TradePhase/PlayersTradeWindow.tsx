import { useState } from "react";
import { EquipmentItem, PlayerInfo, TreasureItem } from "../../Interfaces";
import FromPlayerTrade from "./FromPlayerTrade";
import ToPlayerTrade from "./ToPlayerTrade";
import { IonModal } from "@ionic/react";
import "../GameTurn.scss"

interface PlayersTradewindowProps {
  tradePartnerId: PlayerInfo | undefined;
}
const PlayersTradeWindow: React.FC<PlayersTradewindowProps> = ({tradePartnerId}) => {
  const [tradeState, setTradeState] = useState({
    fromPlayerOffer: {
      equipment: [],
      treasures: [],
      resources: 0,
    },
    toPlayerOffer: {
      equipment: [],
      treasures: [],
      resources: 0,
    },
  });

  console.log("tradePartnerId", tradePartnerId);

  return (
    <div className="tradeWindowContainer">
      Trade Window
      <div>{tradePartnerId?.username}</div>
      {/* <FromPlayerTrade
        showFromPlayerTrade={showFromPlayerTrade}
        setShowFromPlayerTrade={setShowFromPlayerTrade}
        tradeOffer={tradeState.fromPlayerOffer}
        setTradeOffer={(offer) =>
          setTradeState((prev) => ({ ...prev, fromPlayerOffer: offer }))
        }
      />
      <ToPlayerTrade
        showToPlayerTrade={showToPlayerTrade}
        setShowToPlayerTrade={setShowToPlayerTrade}
        tradeOffer={tradeState.toPlayerOffer}
        setTradeOffer={(offer) =>
          setTradeState((prev) => ({ ...prev, toPlayerOffer: offer }))
        }
      /> */}
    </div>
  );
};
export default PlayersTradeWindow;
