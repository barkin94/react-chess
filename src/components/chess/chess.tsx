import "./chess.css";
import { StartingData } from "../../business/chess/board/board.class";
import { Board } from "./board/board";
import { PlayerPanel } from "./player-panel/player-panel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Chess: React.FC<{ matchStartingData: StartingData }> = (props) => {
	const isWaitingTurn = useSelector((state: RootState) => state.gameState.waitingTurn);
	return (
		<div className="chess">
			<PlayerPanel name="You" isWaitingTurn={isWaitingTurn}></PlayerPanel>
			<Board squareData={props.matchStartingData.squareData}></Board>
			<PlayerPanel name="Opponent" isWaitingTurn={!isWaitingTurn}></PlayerPanel>
		</div>
	);
};
