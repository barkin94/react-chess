import "./chess.css";
import { Board } from "./board/board";
import { PlayerPanel } from "./player-panel/player-panel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StartingData } from "../../redux/reducers/board";

export const Chess: React.FC<{ matchStartingData: StartingData }> = (props) => {
	const isWaitingTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const opponentsKilledPieces = useSelector((state: RootState) => state.game.opponentsDeadPieces);
	const yourKilledPieces = useSelector((state: RootState) => state.game.yourDeadPieces);

	return (
		<div className="chess">
			<PlayerPanel name="You" isWaitingTurn={isWaitingTurn} killedPieceIds={yourKilledPieces}></PlayerPanel>
			<Board squareData={props.matchStartingData.squareData}></Board>
			<PlayerPanel
				name="Opponent"
				isWaitingTurn={!isWaitingTurn}
				killedPieceIds={opponentsKilledPieces}
			></PlayerPanel>
		</div>
	);
};
