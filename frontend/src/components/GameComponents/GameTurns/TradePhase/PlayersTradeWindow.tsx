import FromPlayerTrade from "./FromPlayerTrade";
import ToPlayerTrade from "./ToPlayerTrade";

interface PlayersTradewindowProps {}
const PlayersTradeWindow: React.FC<PlayersTradewindowProps> = ({}) => {
    return(
    <FromPlayerTrade/> 
    <ToPlayerTrade/>
    )
};
export default PlayersTradeWindow;