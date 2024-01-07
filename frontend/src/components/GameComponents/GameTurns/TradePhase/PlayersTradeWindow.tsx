import { useState } from "react";
import { EquipmentItem, TreasureItem } from "../../Interfaces";
import FromPlayerTrade from "./FromPlayerTrade";
import ToPlayerTrade from "./ToPlayerTrade";
import { IonModal } from "@ionic/react";

interface PlayersTradewindowProps {
  // showFromPlayerTrade: boolean;
  // setShowFromPlayerTrade: (showFromPlayerTrade: boolean) => void;
  // fromTradeOffer: {
  //   equipment: EquipmentItem[];
  //   treasures: TreasureItem[];
  //   resources: number;
  // };
  // setFromTradeOffer: (tradeOffer: {
  //   equipment: EquipmentItem[];
  //   treasures: TreasureItem[];
  //   resources: number;
  // }) => void;
  // showToPlayerTrade: boolean;
  // setShowToPlayerTrade: (showToPlayerTrade: boolean) => void;
  // toTradeOffer: {
  //   equipment: EquipmentItem[];
  //   treasures: TreasureItem[];
  //   resources: number;
  // };
  // setToTradeOffer: (tradeOffer: {
  //   equipment: EquipmentItem[];
  //   treasures: TreasureItem[];
  //   resources: number;
  // }) => void;
}
const PlayersTradeWindow: React.FC<PlayersTradewindowProps> = ({
  // showFromPlayerTrade,
  // setShowFromPlayerTrade,
  // fromTradeOffer,
  // setFromTradeOffer,
}) => {
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

  console.log("Trade window would be open")

  return (
    <>

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
    </>
  );
};
export default PlayersTradeWindow;
